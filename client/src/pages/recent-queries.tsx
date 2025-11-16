import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/audio-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Volume2, AlertCircle, StopCircle, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { VoiceQuery } from "@shared/schema";

// Browser Speech Synthesis types (already available globally)

interface StaticQuery {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  audio: string | null;
}

// Predefined static recent queries (8 entries as specified)
const STATIC_RECENT_QUERIES: StaticQuery[] = [
  {
    id: 'static-1',
    question: 'What is PM-Kisan eligibility?',
    answer: 'PM-Kisan provides ₹6,000 yearly to small and marginal farmers. Eligibility: land-holding farmer family with valid documents.',
    timestamp: '2 hours ago',
    audio: null
  },
  {
    id: 'static-2',
    question: 'Show today\'s tomato market price',
    answer: 'Today\'s tomato modal price is around ₹1,800 per quintal in nearby mandis.',
    timestamp: '5 hours ago',
    audio: null
  },
  {
    id: 'static-3',
    question: 'Find nearby PHC hospital',
    answer: 'The nearest Primary Health Centre is approximately 1.2 km from your location.',
    timestamp: '8 hours ago',
    audio: null
  },
  {
    id: 'static-4',
    question: 'How to apply for old-age pension?',
    answer: 'Senior citizens above 60 years can apply for pension at their Taluk Office with Aadhaar, ration card, and age proof.',
    timestamp: '1 day ago',
    audio: null
  },
  {
    id: 'static-5',
    question: 'Generate an income certificate draft',
    answer: 'An income certificate application draft has been prepared. You can edit it in the Draft Generator module.',
    timestamp: '1 day ago',
    audio: null
  },
  {
    id: 'static-6',
    question: 'Translate this document to Tamil',
    answer: 'Document translation service is available. Upload your file in the Document Analyzer module.',
    timestamp: '2 days ago',
    audio: null
  },
  {
    id: 'static-7',
    question: 'What services can I access through AI-Sahayak?',
    answer: 'You can access schemes, eligibility checks, market prices, service discovery, drafts, and voice assistant help.',
    timestamp: '2 days ago',
    audio: null
  },
  {
    id: 'static-8',
    question: 'How to get community certificate?',
    answer: 'You must apply at the nearby Tahsildar office with Aadhaar, ration card, and local address proof.',
    timestamp: '3 days ago',
    audio: null
  }
];

export default function RecentQueries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [speakingQueryId, setSpeakingQueryId] = useState<string | null>(null);
  const [expandedQueries, setExpandedQueries] = useState<Set<string>>(new Set());
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const { data: queries, isLoading, isError } = useQuery<VoiceQuery[]>({
    queryKey: ["/api/queries"],
    retry: 1,
  });

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Detect fallback mode - activate if API fails
  useEffect(() => {
    if (isError || !queries || queries.length === 0) {
      setUseFallbackMode(true);
      if (isError) {
        toast({
          title: t('common.warning') || "Warning",
          description: "API not working — showing common recent queries instead.",
          variant: "destructive",
        });
      }
    }
  }, [isError, queries]);

  // TTS helper function with language awareness
  const speakText = (text: string, queryId: string, lang?: string) => {
    if (!synthRef.current) {
      toast({
        title: t('common.error') || "Error",
        description: "Speech synthesis not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map i18n language codes to browser TTS locale codes
    const langMap: { [key: string]: string } = {
      'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
      'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
      'ml': 'ml-IN', 'pa': 'pa-IN'
    };
    
    utterance.lang = lang || langMap[i18n.language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeakingQueryId(queryId);
    utterance.onend = () => setSpeakingQueryId(null);
    utterance.onerror = () => {
      setSpeakingQueryId(null);
      toast({
        title: t('common.error') || "Error",
        description: "Failed to speak the text.",
        variant: "destructive",
      });
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingQueryId(null);
    }
  };

  const toggleQueryExpansion = (queryId: string) => {
    setExpandedQueries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(queryId)) {
        newSet.delete(queryId);
      } else {
        newSet.add(queryId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.success') || "Success",
      description: t('common.copied') || "Copied to clipboard!",
    });
  };

  // Convert static queries to display format
  const staticQueriesDisplay = STATIC_RECENT_QUERIES.map(q => ({
    id: q.id,
    userId: 'static-user',
    transcript: q.question,
    response: q.answer,
    createdAt: new Date(Date.now() - getTimeOffset(q.timestamp)),
    audioUrl: q.audio,
    responseAudioUrl: q.audio
  }));

  // Helper to convert timestamp string to milliseconds offset
  function getTimeOffset(timestamp: string): number {
    if (timestamp.includes('hours')) {
      const hours = parseInt(timestamp);
      return hours * 60 * 60 * 1000;
    } else if (timestamp.includes('day')) {
      const days = parseInt(timestamp);
      return days * 24 * 60 * 60 * 1000;
    }
    return 0;
  }

  // Use real queries or fallback to static
  const displayQueries: VoiceQuery[] = useFallbackMode ? staticQueriesDisplay : (queries || []);
  
  const filteredQueries = displayQueries.filter(
    (q) =>
      q.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{t('queries.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('queries.subtitle')}
        </p>
        {useFallbackMode && (
          <Badge variant="secondary" className="mt-3 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            API not working — showing common recent queries instead.
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('queries.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg h-14"
          />
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredQueries && filteredQueries.length > 0 ? (
          filteredQueries.map((query) => {
            const isExpanded = expandedQueries.has(query.id);
            
            return (
              <Card 
                key={query.id} 
                className={`transition-all hover:shadow-md ${useFallbackMode ? 'border-l-4 border-l-amber-500' : ''}`}
              >
                <CardHeader 
                  className="cursor-pointer select-none"
                  onClick={() => toggleQueryExpansion(query.id)}
                >
                  <CardTitle className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{query.transcript}</span>
                      </div>
                      <span className="text-xs font-normal text-muted-foreground">
                        {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleQueryExpansion(query.id);
                      }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </Button>
                  </CardTitle>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4 pt-0">
                    {/* Question Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t('queries.youAsked')}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(query.transcript)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-base bg-muted/50 p-4 rounded-lg border">
                        {query.transcript}
                      </p>
                      {!useFallbackMode && query.audioUrl && (
                        <AudioPlayer audioUrl={query.audioUrl} />
                      )}
                    </div>

                    {/* Response Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t('queries.aiResponded')}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(query.response)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant={speakingQueryId === query.id ? "destructive" : "default"}
                            size="sm"
                            onClick={() => 
                              speakingQueryId === query.id 
                                ? stopSpeaking() 
                                : speakText(query.response, query.id)
                            }
                          >
                            {speakingQueryId === query.id ? (
                              <>
                                <StopCircle className="h-4 w-4 mr-1" />
                                {t('queries.stopSpeaking') || "Stop"}
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-4 w-4 mr-1" />
                                {t('queries.speak') || "Speak"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-base bg-accent/50 p-4 rounded-lg border">
                        {query.response}
                      </p>
                      {!useFallbackMode && query.responseAudioUrl && (
                        <AudioPlayer audioUrl={query.responseAudioUrl} />
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {searchTerm 
                  ? t('queries.noMatch') || "No queries match your search." 
                  : t('queries.noQueries') || "No recent queries found."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
