import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, FileText, Loader2, Volume2, Languages, AlertCircle, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Document } from "@shared/schema";

interface OCRResult {
  extractedText: string;
  summary: string;
  translation?: string;
  audioUrl?: string;
}

const STATIC_OCR_RESULTS: Record<string, OCRResult> = {
  en: {
    extractedText: "Government of India\n\nAadhaar Card\n\nName: Rajesh Kumar\nDate of Birth: 15/08/1985\nGender: Male\nAadhaar Number: 1234 5678 9012\nAddress: 123 Main Street, Chennai, Tamil Nadu - 600001\n\nEnrollment Date: 12/03/2010",
    summary: "This is an Aadhaar card issued by the Government of India. It contains personal identification details including name (Rajesh Kumar), date of birth (15/08/1985), gender (Male), and a unique 12-digit Aadhaar number (1234 5678 9012). The address listed is in Chennai, Tamil Nadu. The card was enrolled on 12/03/2010.",
  },
  hi: {
    extractedText: "भारत सरकार\n\nआधार कार्ड\n\nनाम: राजेश कुमार\nजन्म तिथि: 15/08/1985\nलिंग: पुरुष\nआधार संख्या: 1234 5678 9012\nपता: 123 मुख्य मार्ग, चेन्नई, तमिलनाडु - 600001\n\nनामांकन तिथि: 12/03/2010",
    summary: "यह भारत सरकार द्वारा जारी एक आधार कार्ड है। इसमें नाम (राजेश कुमार), जन्म तिथि (15/08/1985), लिंग (पुरुष), और 12 अंकों की विशिष्ट आधार संख्या (1234 5678 9012) सहित व्यक्तिगत पहचान विवरण शामिल हैं। सूचीबद्ध पता चेन्नई, तमिलनाडु में है। कार्ड 12/03/2010 को नामांकित किया गया था।",
  },
  ta: {
    extractedText: "இந்திய அரசு\n\nஆதார் அட்டை\n\nபெயர்: ராஜேஷ் குமார்\nபிறந்த தேதி: 15/08/1985\nபாலினம்: ஆண்\nஆதார் எண்: 1234 5678 9012\nமுகவரி: 123 பிரதான தெரு, சென்னை, தமிழ்நாடு - 600001\n\nபதிவு தேதி: 12/03/2010",
    summary: "இது இந்திய அரசால் வழங்கப்பட்ட ஆதார் அட்டை. இதில் பெயர் (ராஜேஷ் குமார்), பிறந்த தேதி (15/08/1985), பாலினம் (ஆண்), மற்றும் 12 இலக்க தனிப்பட்ட ஆதார் எண் (1234 5678 9012) உள்ளிட்ட தனிப்பட்ட அடையாள விவரங்கள் உள்ளன. பட்டியலிடப்பட்ட முகவரி சென்னை, தமிழ்நாட்டில் உள்ளது. அட்டை 12/03/2010 அன்று பதிவு செய்யப்பட்டது.",
  },
};

export default function DocumentAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { data: recentDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { t, i18n } = useTranslation();

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("document", file);
      return apiRequest("POST", "/api/documents/analyze", formData);
    },
    onSuccess: (data: any) => {
      setExtractedText(data.extractedText);
      setSummary(data.summary);
      setUseFallbackMode(false);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: t('documents.analysisComplete'),
        description: t('documents.processed'),
      });
    },
    onError: () => {
      // Static fallback
      setUseFallbackMode(true);
      const fallbackData = STATIC_OCR_RESULTS[i18n.language] || STATIC_OCR_RESULTS.en;
      setExtractedText(fallbackData.extractedText);
      setSummary(fallbackData.summary);
      toast({
        title: t('documents.fallbackMode') || "API not working",
        description: t('documents.staticAnalysis') || "Showing static document analysis",
        variant: "default",
      });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async (data: { text: string; targetLanguage: string }) => {
      return apiRequest("POST", "/api/documents/translate", data);
    },
    onSuccess: (data: any) => {
      setTranslation(data.translation);
    },
    onError: () => {
      // Static fallback translation
      const fallbackData = STATIC_OCR_RESULTS[targetLanguage] || STATIC_OCR_RESULTS.en;
      setTranslation(fallbackData.extractedText);
      toast({
        title: t('documents.fallbackMode') || "API not working",
        description: t('documents.staticTranslation') || "Showing static translation",
        variant: "default",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeMutation.mutate(selectedFile);
    }
  };

  const handleTranslate = () => {
    if (extractedText) {
      translateMutation.mutate({ text: extractedText, targetLanguage });
    }
  };

  const speakText = (text: string) => {
    if (!text) {
      toast({
        title: t('documents.noText'),
        description: t('documents.noTextDesc'),
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'en' ? 'en-US' : 
                       i18n.language === 'hi' ? 'hi-IN' : 
                       i18n.language === 'ta' ? 'ta-IN' : 
                       i18n.language === 'te' ? 'te-IN' : 
                       i18n.language === 'bn' ? 'bn-IN' : 
                       i18n.language === 'mr' ? 'mr-IN' : 
                       i18n.language === 'gu' ? 'gu-IN' : 
                       i18n.language === 'kn' ? 'kn-IN' : 
                       i18n.language === 'ml' ? 'ml-IN' : 
                       i18n.language === 'pa' ? 'pa-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: t('documents.noSpeechSupport') || "Speech not supported",
        description: t('documents.noSpeechDesc') || "Your browser doesn't support text-to-speech",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{t('documents.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('documents.subtitle')}
        </p>
        {useFallbackMode && (
          <Badge variant="outline" className="mt-3 text-sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('documents.fallbackMode') || "API not working — showing static document analysis"}
          </Badge>
        )}
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{t('documents.uploadDocument')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document" className="text-base">{t('documents.selectFile')}</Label>
            <div className="flex gap-4">
              <Input
                id="document"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="flex-1 h-12 text-base"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzeMutation.isPending}
                size="lg"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('documents.analyzing')}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    {t('documents.analyze')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">{t('documents.selected')}: {selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {extractedText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{t('documents.results')}</CardTitle>
              {isSpeaking && (
                <Button variant="destructive" size="sm" onClick={stopSpeaking}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  {t('documents.stopSpeaking') || "Stop"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="extracted">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('documents.extractedText')}
                </TabsTrigger>
                <TabsTrigger value="summary">
                  {t('documents.summary')}
                </TabsTrigger>
                <TabsTrigger value="translation">
                  <Languages className="mr-2 h-4 w-4" />
                  {t('documents.translation')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="extracted" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => speakText(extractedText)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('documents.readAloud')}
                  </Button>
                </div>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[300px] text-base"
                />
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => speakText(summary)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('documents.readAloud')}
                  </Button>
                </div>
                <div className="p-6 bg-muted/50 rounded-md">
                  <p className="text-base leading-relaxed">
                    {summary}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="translation" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="targetLanguage" className="text-sm">{t('documents.translateTo')}:</Label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger id="targetLanguage" className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                        <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                        <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                        <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleTranslate}
                      disabled={translateMutation.isPending}
                    >
                      {translateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('documents.translating')}
                        </>
                      ) : (
                        t('documents.translate')
                      )}
                    </Button>
                  </div>
                  {translation && (
                    <Button
                      variant="outline"
                      onClick={() => speakText(translation)}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      {t('documents.readAloud')}
                    </Button>
                  )}
                </div>
                {translation && (
                  <div className="p-6 bg-muted/50 rounded-md">
                    <p className="text-base leading-relaxed">
                      {translation}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Recent Documents */}
      {recentDocuments && recentDocuments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">{t('documents.recentDocuments')}</h2>
          <div className="grid gap-4">
            {recentDocuments.slice(0, 5).map((doc) => (
              <Card key={doc.id} className="hover-elevate">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{doc.fileName}</h3>
                      <p className="text-sm text-muted-foreground">{doc.fileType}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {t('documents.analyzed')}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
