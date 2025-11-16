import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Mic,
  History,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  MapPin,
  PenTool,
  Volume2,
  AlertCircle,
  StopCircle,
} from "lucide-react";
import type { User, VoiceQuery } from "@shared/schema";
import heroImage from "@assets/generated_images/Rural_farmer_using_smartphone_9c774d5b.png";
import { useTranslation } from "react-i18next";

interface MarketSnapshot {
  commodity: string;
  price: number;
  trend: "up" | "down" | "stable";
}

// Static fallback data
const STATIC_RECENT_QUERIES = [
  {
    id: 1,
    query: "What is PM-Kisan eligibility?",
    response: "PM-Kisan scheme is for small and marginal farmers with cultivable land up to 2 hectares. Benefits: ₹6,000/year in 3 installments.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    query: "How to apply for Aadhaar card?",
    response: "Visit nearest Aadhaar enrollment center with identity and address proof. Biometric capture done. Card issued within 90 days.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    query: "Local mandi price for tomato?",
    response: "Current tomato price: ₹1800/quintal in Tamil Nadu mandis. Price increasing due to seasonal demand.",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

const STATIC_MARKET_SNAPSHOT: MarketSnapshot[] = [
  { commodity: "Wheat", price: 2400, trend: "stable" },
  { commodity: "Tomato", price: 1800, trend: "up" },
  { commodity: "Paddy", price: 2200, trend: "stable" },
];

const getModules = (t: (key: string) => string) => [
  {
    titleKey: "dashboard.modules.voice.title",
    descriptionKey: "dashboard.modules.voice.description",
    icon: Mic,
    url: "/assistant/voice",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    titleKey: "dashboard.modules.queries.title",
    descriptionKey: "dashboard.modules.queries.description",
    icon: History,
    url: "/queries",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    titleKey: "dashboard.modules.eligibility.title",
    descriptionKey: "dashboard.modules.eligibility.description",
    icon: CheckCircle,
    url: "/eligibility",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    titleKey: "dashboard.modules.markets.title",
    descriptionKey: "dashboard.modules.markets.description",
    icon: TrendingUp,
    url: "/markets",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    titleKey: "dashboard.modules.chat.title",
    descriptionKey: "dashboard.modules.chat.description",
    icon: MessageSquare,
    url: "/assistant/chat",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    titleKey: "dashboard.modules.documents.title",
    descriptionKey: "dashboard.modules.documents.description",
    icon: FileText,
    url: "/documents/analyze",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    titleKey: "dashboard.modules.services.title",
    descriptionKey: "dashboard.modules.services.description",
    icon: MapPin,
    url: "/services/search",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    titleKey: "dashboard.modules.drafts.title",
    descriptionKey: "dashboard.modules.drafts.description",
    icon: PenTool,
    url: "/drafts",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
];

export default function Dashboard() {
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasWelcomed = useRef(false);
  const lastLanguage = useRef<string>('');

  const { data: user, error: userError } = useQuery<User>({
    queryKey: ["/api/user/current"],
    retry: 1,
  });

  const { data: recentQueries, error: queriesError } = useQuery<VoiceQuery[]>({
    queryKey: ["/api/queries"],
    retry: 1,
  });

  const { data: marketData, error: marketError } = useQuery<MarketSnapshot[]>({
    queryKey: ["/api/markets/snapshot"],
    retry: 1,
  });

  const { t, i18n } = useTranslation();
  const modules = getModules(t);

  // Trigger fallback mode on error
  useEffect(() => {
    if (userError || queriesError || marketError) {
      setUseFallbackMode(true);
    }
  }, [userError, queriesError, marketError]);

  // Display data with fallback
  const displayUser = user || { username: "Proud Indian", fullName: "Proud Indian" };
  const displayQueries = useFallbackMode || queriesError ? STATIC_RECENT_QUERIES : (recentQueries?.slice(0, 3) || []);
  const displayMarket = useFallbackMode || marketError ? STATIC_MARKET_SNAPSHOT : (marketData || []);

  // Voice greeting - ONLY on first load or language change
  useEffect(() => {
    // Check if language changed
    const languageChanged = lastLanguage.current !== '' && lastLanguage.current !== i18n.language;
    
    // Speak only if: first time (hasWelcomed = false) OR language changed
    if ((!hasWelcomed.current || languageChanged) && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const greeting = `${t('dashboard.voiceGreeting')} ${displayUser.fullName || displayUser.username}. ${t('dashboard.voiceWelcome')}`;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(greeting);
        
        const langMap: { [key: string]: string } = {
          'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
          'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
          'ml': 'ml-IN', 'pa': 'pa-IN'
        };
        
        utterance.lang = langMap[i18n.language] || 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
        
        // Mark as welcomed and update last language
        hasWelcomed.current = true;
        lastLanguage.current = i18n.language;
      }, 1000);
    } else if (!hasWelcomed.current) {
      // If first load but no speech support, just mark as welcomed
      hasWelcomed.current = true;
      lastLanguage.current = i18n.language;
    }
  }, [i18n.language, t, displayUser.fullName, displayUser.username]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Rural India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              {t('dashboard.welcome')}, {displayUser.fullName || displayUser.username}
            </h1>
            {isSpeaking && (
              <Button variant="destructive" size="sm" onClick={stopSpeaking}>
                <StopCircle className="mr-2 h-4 w-4" />
                {t('dashboard.stopSpeaking') || "Stop"}
              </Button>
            )}
          </div>
          <p className="text-xl md:text-2xl max-w-3xl">
            {t('dashboard.description')}
          </p>
          {useFallbackMode && (
            <Badge variant="outline" className="mt-4 text-sm bg-white/20 border-white/40 text-white">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t('dashboard.fallbackMode') || "API not working — showing static dashboard snapshot"}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Queries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <History className="h-5 w-5" />
                {t('dashboard.recentQueries')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayQueries.length > 0 ? (
                displayQueries.map((query: any) => (
                  <div key={query.id} className="p-3 bg-muted/50 rounded-md">
                    <p className="font-medium text-sm mb-1">{query.query}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {query.response}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('dashboard.noRecentQueries')}</p>
              )}
              <Link href="/queries">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  {t('dashboard.viewAll')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Market Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5" />
                {t('dashboard.marketSnapshot')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayMarket.length > 0 ? (
                displayMarket.map((item: MarketSnapshot, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{item.commodity}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price}/qtl</p>
                    </div>
                    <Badge variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}>
                      {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('dashboard.noMarketData')}</p>
              )}
              <Link href="/markets">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  {t('dashboard.viewAll')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('dashboard.quickAccess')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.chooseService')}
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link key={module.titleKey} href={module.url}>
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full transition-all">
                <CardHeader className="space-y-4">
                  <div className={`w-24 h-24 rounded-lg ${module.bgColor} flex items-center justify-center mx-auto`}>
                    <module.icon className={`h-12 w-12 ${module.color}`} />
                  </div>
                  <CardTitle className="text-xl text-center">{t(module.titleKey)}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {t(module.descriptionKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button variant="default" className="w-full" size="lg">
                    {t('dashboard.open')}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Voice Shortcuts Info */}
        <Card className="mt-12 bg-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Volume2 className="h-6 w-6" />
              {t('dashboard.voiceShortcuts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground mb-4">
              {t('dashboard.voiceShortcutsDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-background rounded-md">
                <p className="font-medium text-sm">"{t('dashboard.voiceExample1')}"</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="font-medium text-sm">"{t('dashboard.voiceExample2')}"</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="font-medium text-sm">"{t('dashboard.voiceExample3')}"</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="font-medium text-sm">"{t('dashboard.voiceExample4')}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
