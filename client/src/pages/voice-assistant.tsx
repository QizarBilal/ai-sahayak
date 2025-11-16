import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaveformVisualization } from "@/components/waveform-visualization";
import { useToast } from "@/hooks/use-toast";
import { Mic, Volume2, Loader2, RotateCcw, AlertCircle, StopCircle, Play, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

// API Keys - Use environment variables or fallback to browser-only mode
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const WHISPER_STT_TOKEN = import.meta.env.VITE_WHISPER_STT_TOKEN || "";

// Browser Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface QueryHistory {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  language: string;
  mode: 'realtime' | 'fallback';
}

type VoiceMode = 'idle' | 'recording' | 'processing' | 'speaking';

export default function VoiceAssistant() {
  const [mode, setMode] = useState<VoiceMode>('idle');
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REAL-TIME AI PIPELINE: Whisper STT → OpenRouter LLM → Browser TTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // STEP 1: Transcribe Audio using HuggingFace Whisper
  const transcribeAudioRealTime = async (audioBlob: Blob): Promise<string> => {
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHISPER_STT_TOKEN}`,
          "Content-Type": "audio/wav"
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error(`Whisper API failed: ${response.status}`);
      }

      const result = await response.json();
      return result.text || "";
    } catch (error) {
      console.error("Whisper STT failed:", error);
      throw error;
    }
  };

  // STEP 2: Get AI Response using OpenRouter
  const getAIResponseRealTime = async (userText: string): Promise<string> => {
    try {
      const systemMessage = `Respond in ${getLangNameForAI(i18n.language)}. Make the answer extremely simple and rural-friendly for government services. Keep responses under 100 words.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI-Sahayak Voice Assistant"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3:free",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userText }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API failed: ${response.status}`);
      }

      const result = await response.json();
      return result.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenRouter LLM failed:", error);
      throw error;
    }
  };

  // STEP 3: Speak using Browser TTS
  const speakTextWithBrowser = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: { [key: string]: string } = {
      'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
      'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
      'ml': 'ml-IN', 'pa': 'pa-IN'
    };
    utterance.lang = langMap[i18n.language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setMode('speaking');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setMode('idle');
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setMode('idle');
    };
    
    synthRef.current.speak(utterance);
  };

  const getLangNameForAI = (langCode: string): string => {
    const names: { [key: string]: string } = {
      'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
      'bn': 'Bengali', 'mr': 'Marathi', 'gu': 'Gujarati', 'kn': 'Kannada',
      'ml': 'Malayalam', 'pa': 'Punjabi'
    };
    return names[langCode] || 'English';
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATIC FALLBACK MODE: When Real-Time APIs Fail
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const generateStaticFallback = (userText: string): string => {
    const responses: { [key: string]: string } = {
      'en': `API not working — showing safe static fallback response.\n\nYou asked: "${userText}"\n\nAI-Sahayak helps you check scheme eligibility, market prices, nearby services, and understand government documents. Please retry with internet or valid API keys for full real-time answers.`,
      'hi': `API काम नहीं कर रहा — सुरक्षित स्थिर फ़ॉलबैक प्रतिक्रिया दिखा रहे हैं।\n\nआपने पूछा: "${userText}"\n\nAI-Sahayak आपको योजना पात्रता जांचने, बाजार की कीमतें देखने, आस-पास की सेवाएं खोजने और सरकारी दस्तावेज़ समझने में मदद करता है। पूर्ण रियल-टाइम उत्तरों के लिए इंटरनेट या वैध API कुंजियों के साथ पुनः प्रयास करें।`,
      'ta': `API வேலை செய்யவில்லை — பாதுகாப்பான நிலையான மாற்று பதிலைக் காட்டுகிறது.\n\nநீங்கள் கேட்டது: "${userText}"\n\nAI-Sahayak திட்டத் தகுதியைச் சரிபார்க்கவும், சந்தை விலைகளைப் பார்க்கவும், அருகிலுள்ள சேவைகளைக் கண்டறியவும், அரசு ஆவணங்களைப் புரிந்துகொள்ளவும் உதவுகிறது. முழு நிகழ்நேர பதில்களுக்கு இணையம் அல்லது செல்லுபடியாகும் API விசைகளுடன் மீண்டும் முயற்சிக்கவும்.`,
      'te': `API పని చేయడం లేదు — సురక్షితమైన స్థిర ఫాల్‌బ్యాక్ ప్రతిస్పందన చూపిస్తోంది.\n\nమీరు అడిగారు: "${userText}"\n\nAI-Sahayak పథక అర్హత తనిఖీ చేయడానికి, మార్కెట్ ధరలను చూడటానికి, సమీపంలోని సేవలను కనుగొనడానికి మరియు ప్రభుత్వ పత్రాలను అర్థం చేసుకోవడానికి మీకు సహాయపడుతుంది. పూర్తి రియల్-టైమ్ సమాధానాల కోసం ఇంటర్నెట్ లేదా చెల్లుబాటు అయ్యే API కీలతో మళ్లీ ప్రయత్నించండి.`,
      'bn': `API কাজ করছে না — নিরাপদ স্থির ফলব্যাক প্রতিক্রিয়া দেখাচ্ছে।\n\nআপনি জিজ্ঞাসা করেছেন: "${userText}"\n\nAI-Sahayak আপনাকে প্রকল্পের যোগ্যতা যাচাই করতে, বাজার মূল্য দেখতে, কাছের পরিষেবা খুঁজে পেতে এবং সরকারি নথি বুঝতে সাহায্য করে। সম্পূর্ণ রিয়েল-টাইম উত্তরের জন্য ইন্টারনেট বা বৈধ API কী দিয়ে আবার চেষ্টা করুন।`,
      'mr': `API काम करत नाही — सुरक्षित स्थिर फॉलबॅक प्रतिसाद दाखवत आहे.\n\nतुम्ही विचारले: "${userText}"\n\nAI-Sahayak तुम्हाला योजना पात्रता तपासण्यात, बाजार किंमती पाहण्यात, जवळच्या सेवा शोधण्यात आणि सरकारी कागदपत्रे समजून घेण्यात मदत करते. पूर्ण रिअल-टाइम उत्तरांसाठी इंटरनेट किंवा वैध API की सह पुन्हा प्रयत्न करा.`,
      'gu': `API કામ કરી રહ્યું નથી — સુરક્ષિત સ્થિર ફોલબેક પ્રતિસાદ બતાવી રહ્યું છે.\n\nતમે પૂછ્યું: "${userText}"\n\nAI-Sahayak તમને યોજના પાત્રતા તપાસવા, બજાર ભાવ જોવા, નજીકની સેવાઓ શોધવા અને સરકારી દસ્તાવેજો સમજવામાં મદદ કરે છે. સંપૂર્ણ રિયલ-ટાઇમ જવાબો માટે ઇન્ટરનેટ અથવા માન્ય API કી સાથે ફરી પ્રયાસ કરો.`,
      'kn': `API ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ — ಸುರಕ್ಷಿತ ಸ್ಥಿರ ಫಾಲ್‌ಬ್ಯಾಕ್ ಪ್ರತಿಕ್ರಿಯೆ ತೋರಿಸುತ್ತಿದೆ.\n\nನೀವು ಕೇಳಿದ್ದು: "${userText}"\n\nAI-Sahayak ನಿಮಗೆ ಯೋಜನಾ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ನೋಡಲು, ಹತ್ತಿರದ ಸೇವೆಗಳನ್ನು ಹುಡುಕಲು ಮತ್ತು ಸರ್ಕಾರಿ ದಾಖಲೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಸಂಪೂರ್ಣ ನೈಜ-ಸಮಯದ ಉತ್ತರಗಳಿಗಾಗಿ ಇಂಟರ್ನೆಟ್ ಅಥವಾ ಮಾನ್ಯ API ಕೀಗಳೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`,
      'ml': `API പ്രവർത്തിക്കുന്നില്ല — സുരക്ഷിത സ്ഥിര ഫാൾബാക്ക് പ്രതികരണം കാണിക്കുന്നു.\n\nനിങ്ങൾ ചോദിച്ചത്: "${userText}"\n\nAI-Sahayak പദ്ധതി യോഗ്യത പരിശോധിക്കാനും വിപണി വിലകൾ കാണാനും സമീപസ്ഥ സേവനങ്ങൾ കണ്ടെത്താനും സർക്കാർ രേഖകൾ മനസ്സിലാക്കാനും നിങ്ങളെ സഹായിക്കുന്നു. പൂർണ്ണ തത്സമയ ഉത്തരങ്ങൾക്കായി ഇന്റർനെറ്റ് അല്ലെങ്കിൽ സാധുവായ API കീകൾ ഉപയോഗിച്ച് വീണ്ടും ശ്രമിക്കുക.`,
      'pa': `API ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ — ਸੁਰੱਖਿਅਤ ਸਥਿਰ ਫਾਲਬੈਕ ਜਵਾਬ ਦਿਖਾ ਰਿਹਾ ਹੈ.\n\nਤੁਸੀਂ ਪੁੱਛਿਆ: "${userText}"\n\nAI-Sahayak ਤੁਹਾਨੂੰ ਯੋਜਨਾ ਯੋਗਤਾ ਜਾਂਚਣ, ਮਾਰਕੀਟ ਕੀਮਤਾਂ ਦੇਖਣ, ਨਜ਼ਦੀਕੀ ਸੇਵਾਵਾਂ ਲੱਭਣ ਅਤੇ ਸਰਕਾਰੀ ਦਸਤਾਵੇਜ਼ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ. ਪੂਰੇ ਰੀਅਲ-ਟਾਈਮ ਜਵਾਬਾਂ ਲਈ ਇੰਟਰਨੈੱਟ ਜਾਂ ਵੈਧ API ਕੁੰਜੀਆਂ ਨਾਲ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.`
    };

    return responses[i18n.language] || responses['en'];
  };

  const processStaticFallback = async (userText: string) => {
    try {
      setMode('processing');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const staticResponse = generateStaticFallback(userText);
      setResponse(staticResponse);
      setMode('idle');
      
      saveToHistory(userText, staticResponse, 'fallback');
      speakTextWithBrowser(staticResponse);
      
      toast({
        title: t('toasts.success'),
        description: "Query processed in fallback mode",
      });
    } catch (error) {
      console.error('Error in static fallback:', error);
      setMode('idle');
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INITIALIZE BROWSER APIS & LOAD HISTORY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        const langMap: { [key: string]: string } = {
          'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
          'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
          'ml': 'ml-IN', 'pa': 'pa-IN'
        };
        recognitionRef.current.lang = langMap[i18n.language] || 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
          processStaticFallback(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setMode('idle');
          setIsListening(false);
          toast({
            title: t('common.error'),
            description: "Speech recognition unavailable",
            variant: "destructive"
          });
        };

        recognitionRef.current.onend = () => {
          // Only restart if user did not press stop
          if (isListening && mode === 'recording') {
            return;
          }
          setIsListening(false);
          if (mode === 'recording') {
            setMode('idle');
          }
        };
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    const savedHistory = localStorage.getItem('voice-query-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setQueryHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse query history:', e);
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      const langMap: { [key: string]: string } = {
        'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
        'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
        'ml': 'ml-IN', 'pa': 'pa-IN'
      };
      recognitionRef.current.lang = langMap[i18n.language] || 'en-US';
    }
  }, [i18n.language]);

  const saveToHistory = (query: string, resp: string, apiMode: 'realtime' | 'fallback') => {
    const newQuery: QueryHistory = {
      id: Date.now().toString(),
      query,
      response: resp,
      timestamp: new Date(),
      language: i18n.language,
      mode: apiMode
    };
    
    const updatedHistory = [newQuery, ...queryHistory].slice(0, 10);
    setQueryHistory(updatedHistory);
    localStorage.setItem('voice-query-history', JSON.stringify(updatedHistory));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RECORDING HANDLERS: Try Real-Time First, Fallback on Error
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const startRealTimeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setMode('processing');
        
        try {
          // STEP 1: Transcribe with Whisper
          const transcribedText = await transcribeAudioRealTime(audioBlob);
          setTranscript(transcribedText);
          
          // STEP 2: Get AI Response from OpenRouter
          const aiResponse = await getAIResponseRealTime(transcribedText);
          setResponse(aiResponse);
          
          // STEP 3: Speak response with Browser TTS
          speakTextWithBrowser(aiResponse);
          
          saveToHistory(transcribedText, aiResponse, 'realtime');
          setUseFallbackMode(false);
          setErrorMessage("");
          
          toast({
            title: t('toasts.success'),
            description: "Real-time AI response received",
          });
          
        } catch (error) {
          console.error('Real-time pipeline failed:', error);
          
          setUseFallbackMode(true);
          setErrorMessage("API not working — switching to fallback mode");
          
          toast({
            title: t('common.warning'),
            description: "API failed — using browser fallback",
            variant: "destructive",
          });
          
          // Fallback to browser recognition
          startBrowserRecognition();
        }
        
        stream.getTracks().forEach(track => track.stop());
        setMode('idle');
      };
      
      mediaRecorderRef.current.start();
      setMode('recording');
      setIsListening(true);
      setTranscript("");
      setResponse("");
      setErrorMessage("");
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast({
        title: t('common.error'),
        description: "Could not access microphone",
        variant: "destructive",
      });
      
      setUseFallbackMode(true);
      startBrowserRecognition();
    }
  };

  const stopRealTimeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const startBrowserRecognition = () => {
    if (!recognitionRef.current) {
      setErrorMessage("Speech recognition not available");
      return;
    }
    
    try {
      setTranscript("");
      setResponse("");
      setMode('recording');
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Recognition start error:', error);
      setMode('idle');
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setMode('idle');
    window.speechSynthesis.cancel();
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setMode('idle');
    }
  };

  const handleStartRecording = () => {
    if (useFallbackMode) {
      startBrowserRecognition();
    } else {
      startRealTimeRecording();
    }
  };

  const handleStopRecording = () => {
    if (mode === 'recording') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      stopRealTimeRecording();
    }
  };

  const resetConversation = () => {
    setTranscript("");
    setResponse("");
    setErrorMessage("");
    stopSpeaking();
    handleStopRecording();
  };

  const speakResponseAgain = () => {
    if (response) {
      speakTextWithBrowser(response);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">{t('voice.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('voice.subtitle')}
        </p>
        {useFallbackMode && (
          <Badge variant="secondary" className="mt-3 gap-1">
            <AlertCircle className="h-3 w-3" />
            {t('voice.offlineMode') || "Fallback Mode"}
          </Badge>
        )}
      </div>

      {errorMessage && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* API INFO PANEL */}
      {!useFallbackMode && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                <p className="font-semibold">Real-Time AI Mode Active</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-200">
                  <li>STT: HuggingFace Whisper API</li>
                  <li>LLM: OpenRouter (DeepSeek/Llama/Mistral)</li>
                  <li>TTS: Browser SpeechSynthesis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardContent className="p-12 flex flex-col items-center gap-8">
          <div className="w-full max-w-md">
            <WaveformVisualization isActive={mode === 'recording' || mode === 'processing'} />
          </div>

          <div className="relative">
            <Button
              size="lg"
              onClick={mode === 'recording' ? handleStopRecording : handleStartRecording}
              disabled={mode === 'processing' || mode === 'speaking'}
              className={`
                h-32 w-32 rounded-full transition-all duration-300
                ${mode === 'recording' 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-primary hover:bg-primary/90 shadow-xl'
                }
                ${mode === 'processing' || mode === 'speaking' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {mode === 'processing' ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : mode === 'recording' ? (
                <StopCircle className="h-16 w-16" />
              ) : (
                <Mic className="h-16 w-16" />
              )}
            </Button>
            
            {mode === 'recording' && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">
              {mode === 'processing' && (t('voice.processing') || "Processing...")}
              {mode === 'recording' && (t('voice.listening') || "Listening...")}
              {mode === 'speaking' && (t('common.speaking') || "Speaking...")}
              {mode === 'idle' && (t('voice.tapToSpeak') || "Tap to speak")}
            </p>
            <p className="text-sm text-muted-foreground">
              {useFallbackMode 
                ? "Browser Speech Recognition + Static Fallback"
                : "Real-time: Whisper STT → OpenRouter LLM → Browser TTS"}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            {isListening && (
              <Button
                variant="destructive"
                onClick={handleStopListening}
                className="gap-2 font-medium animate-pulse"
              >
                <StopCircle className="h-4 w-4" />
                Stop Listening
              </Button>
            )}
            {(transcript || response) && (
              <Button
                variant="outline"
                onClick={resetConversation}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t('voice.speakAgain') || "New Query"}
              </Button>
            )}
            {response && !isSpeaking && (
              <Button
                variant="outline"
                onClick={speakResponseAgain}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {t('voice.speak') || "Speak Output"}
              </Button>
            )}
            {isSpeaking && (
              <Button
                variant="outline"
                onClick={stopSpeaking}
                className="gap-2"
              >
                <StopCircle className="h-4 w-4" />
                {t('common.stopSpeaking') || "Stop Speaking"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {transcript && (
        <Card className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Mic className="h-5 w-5" />
              {t('voice.youSaid')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
              {transcript}
            </p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {t('voice.aiResponse')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-green-800 dark:text-green-200 whitespace-pre-wrap leading-relaxed">
              {response}
            </p>
          </CardContent>
        </Card>
      )}

      {queryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {t('voice.recentQueries') || "Recent Queries"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {queryHistory.slice(0, 5).map((query) => (
              <div
                key={query.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => {
                  setTranscript(query.query);
                  setResponse(query.response);
                  if (useFallbackMode || query.mode === 'fallback') {
                    speakTextWithBrowser(query.response);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">{query.query}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {query.response.split('\n')[0]}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={query.mode === 'realtime' ? 'default' : 'secondary'} className="text-xs">
                      {query.mode === 'realtime' ? 'Real-time' : 'Fallback'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {query.language.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(query.timestamp).toLocaleTimeString(i18n.language, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
