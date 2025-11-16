import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, Loader2, Volume2, Mic, MessageSquare, Plus, AlertCircle, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Conversation, Message } from "@shared/schema";
import { getStaticAnswer } from "@/data/chatStaticKnowledge";

// Browser Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type ChatMode = 'idle' | 'recording' | 'sending' | 'speaking';

export default function ChatAssistant() {
  const [mode, setMode] = useState<ChatMode>('idle');
  const [inputText, setInputText] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
  });

  // Send Message Mutation with fallback
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      return apiRequest("POST", "/api/chat", {
        message: data.content,
        conversationId: currentConversationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setInputText("");
      setMode('idle');
      scrollToBottom();
    },
    onError: (error: any) => {
      console.error('API chat failed:', error);
      setMode('idle');
      
      // Fallback mode: Add static response locally
      const staticResponse = generateStaticFallback(inputText);
      
      // Create mock message locally
      const mockUserMessage: Message = {
        id: Date.now().toString(),
        conversationId: currentConversationId || 'local',
        content: inputText,
        role: 'user',
        audioUrl: null,
        createdAt: new Date(),
      };
      
      const mockAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: currentConversationId || 'local',
        content: staticResponse,
        role: 'assistant',
        audioUrl: null,
        createdAt: new Date(),
      };
      
      // Store in localStorage for offline mode
      const localMessages = JSON.parse(localStorage.getItem('chat-fallback-messages') || '[]');
      localMessages.push(mockUserMessage, mockAIMessage);
      localStorage.setItem('chat-fallback-messages', JSON.stringify(localMessages.slice(-50)));
      
      setUseFallbackMode(true);
      setInputText("");
      
      toast({
        title: t('common.warning'),
        description: t('chat.fallbackMode') || "API not working — showing safe conversational fallback response.",
        variant: "destructive",
      });
      
      // Force refetch
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      
      // Speak response
      speakText(staticResponse);
    },
  });

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/conversations", {
        title: t('chat.newConversation') || "New Chat",
      });
    },
    onSuccess: (data: any) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: t('toasts.success'),
        description: t('chat.conversationCreated') || "New conversation started",
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('chat.conversationError') || "Could not create conversation",
        variant: "destructive",
      });
    },
  });

  // Initialize Browser Speech APIs
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
          setInputText(text);
          setMode('idle');
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setMode('idle');
          toast({
            title: t('common.error'),
            description: t('chat.voiceInputError') || "Voice input failed",
            variant: "destructive",
          });
        };

        recognitionRef.current.onend = () => {
          setMode('idle');
        };
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Update recognition language when i18n changes
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

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial conversation
  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateStaticFallback = (userQuery: string): string => {
    // Use comprehensive static knowledge base with 400+ entries
    return getStaticAnswer(userQuery);
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: t('common.error'),
        description: t('chat.noSpeechSupport') || "Speech recognition not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setMode('recording');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Recognition start error:', error);
      setMode('idle');
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setMode('idle');
  };

  const speakText = (text: string, messageId?: string) => {
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
    utterance.pitch = 1;

    if (messageId) {
      utterance.onstart = () => {
        setSpeakingMessageId(messageId);
        setMode('speaking');
      };
      utterance.onend = () => {
        setSpeakingMessageId(null);
        setMode('idle');
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
        setMode('idle');
      };
    }

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      setMode('idle');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || mode === 'sending') return;
    
    setMode('sending');
    sendMessageMutation.mutate({ content: inputText });
  };

  const handleNewConversation = () => {
    createConversationMutation.mutate();
  };

  return (
    <div className="container mx-auto px-6 py-8 h-[calc(100vh-8rem)] flex flex-col max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('chat.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('chat.subtitle')}
          </p>
          {useFallbackMode && (
            <Badge variant="secondary" className="mt-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t('chat.offlineMode') || "Offline Mode"}
            </Badge>
          )}
        </div>
        <Button
          onClick={handleNewConversation}
          disabled={createConversationMutation.isPending}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('chat.newConversation') || "New Chat"}
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Conversations Sidebar */}
        <Card className="w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('chat.conversations') || "Conversations"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2 p-4">
                {conversations && conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <Button
                      key={conv.id}
                      variant={currentConversationId === conv.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setCurrentConversationId(conv.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {conv.title || t('chat.untitled') || "Untitled Chat"}
                      </span>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t('chat.noConversations') || "No conversations yet"}
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-w-0">
          <CardContent className="flex-1 flex flex-col p-6 min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4 mb-6">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[70%] rounded-2xl px-5 py-3 shadow-sm
                          ${message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        
                        {message.role === 'assistant' && (
                          <div className="mt-3 flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => 
                                speakingMessageId === message.id 
                                  ? stopSpeaking() 
                                  : speakText(message.content, message.id)
                              }
                              className="h-7 px-2 gap-1 hover:bg-primary/10"
                            >
                              {speakingMessageId === message.id ? (
                                <>
                                  <StopCircle className="h-3 w-3" />
                                  <span className="text-xs">{t('chat.stopSpeaking') || "Stop"}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3 w-3" />
                                  <span className="text-xs">{t('chat.speakThis') || "Speak"}</span>
                                </>
                              )}
                            </Button>
                            <span className="text-xs opacity-60">
                              {new Date(message.createdAt).toLocaleTimeString(i18n.language, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t('chat.startConversation') || "Start a conversation"}
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('chat.typeMessage') || "Type your message..."}
                  disabled={mode === 'sending' || mode === 'recording'}
                  className="pr-12 text-base py-6 rounded-2xl"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={mode === 'recording' ? stopVoiceInput : startVoiceInput}
                  disabled={mode === 'sending'}
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full
                    ${mode === 'recording' ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : ''}
                  `}
                >
                  {mode === 'recording' ? (
                    <StopCircle className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Button
                type="submit"
                size="lg"
                disabled={!inputText.trim() || mode === 'sending' || mode === 'recording'}
                className="h-12 w-12 rounded-full p-0"
              >
                {mode === 'sending' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
