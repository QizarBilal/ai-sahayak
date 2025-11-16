import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Volume2, Minus, AlertCircle, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface MarketPrice {
  commodity: string;
  market: string;
  state: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  unit: string;
  date: string;
  trend: "up" | "down" | "stable";
  change: number;
}

interface StaticMarketPrice {
  commodity: string;
  market: string;
  state: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  unit: string;
  date: string;
  trend: "up" | "down" | "stable";
  change: number;
}

const STATIC_MARKET_PRICES: StaticMarketPrice[] = [
  {
    commodity: "Dry Chillies",
    market: "Pidugurala",
    state: "Andhra Pradesh",
    price: 151,
    minPrice: 115,
    maxPrice: 154,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 25.8,
  },
  {
    commodity: "Lemon",
    market: "Chintalapudi",
    state: "Andhra Pradesh",
    price: 8,
    minPrice: 7,
    maxPrice: 9,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 25,
  },
  {
    commodity: "Bhindi (Ladies Finger)",
    market: "Damnagar",
    state: "Gujarat",
    price: 20,
    minPrice: 16.5,
    maxPrice: 25.5,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 45,
  },
  {
    commodity: "Cauliflower",
    market: "Bharuch",
    state: "Gujarat",
    price: 20,
    minPrice: 15,
    maxPrice: 25,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 50,
  },
  {
    commodity: "Green Chilli",
    market: "Bharuch",
    state: "Gujarat",
    price: 15,
    minPrice: 12,
    maxPrice: 20,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 53.3,
  },
  {
    commodity: "Lemon",
    market: "Bharuch",
    state: "Gujarat",
    price: 25,
    minPrice: 20,
    maxPrice: 30,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 40,
  },
  {
    commodity: "Cotton",
    market: "Jambusar",
    state: "Gujarat",
    price: 65,
    minPrice: 63,
    maxPrice: 67,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 6.2,
  },
  {
    commodity: "Maize",
    market: "Jambusar",
    state: "Gujarat",
    price: 22,
    minPrice: 20,
    maxPrice: 24,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 18.2,
  },
  {
    commodity: "Methi (Leaves)",
    market: "Mansa",
    state: "Gujarat",
    price: 30,
    minPrice: 25,
    maxPrice: 30,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "up",
    change: 16.7,
  },
  {
    commodity: "Tomato",
    market: "Mansa",
    state: "Gujarat",
    price: 10,
    minPrice: 10,
    maxPrice: 10,
    unit: "kg",
    date: new Date().toISOString(),
    trend: "stable",
    change: 0,
  },
];

export default function MarketData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const { t, i18n } = useTranslation();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { data: marketPrices, isLoading, error } = useQuery<MarketPrice[]>({
    queryKey: ["/api/markets"],
    refetchInterval: 300000, // Refresh every 5 minutes
    retry: 2,
  });

  // Trigger fallback mode on error
  useEffect(() => {
    if (error) {
      setUseFallbackMode(true);
    }
  }, [error]);

  // Use static fallback if API fails
  const displayPrices: (MarketPrice | StaticMarketPrice)[] = useFallbackMode || error ? STATIC_MARKET_PRICES : (marketPrices || []);

  const filteredPrices = displayPrices.filter(
    (p: MarketPrice | StaticMarketPrice) =>
      p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = filteredPrices.slice(0, 7).map((p: MarketPrice | StaticMarketPrice, idx: number) => ({
    name: p.commodity.substring(0, 15),
    price: p.price,
    index: idx,
  }));

  const speakText = (text: string, index?: number) => {
    if (typeof index === 'number') {
      setSpeakingIndex(index);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
        setSpeakingIndex(null);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  };

  const handleSpeakSummary = () => {
    if (!filteredPrices || filteredPrices.length === 0) {
      speakText(t('markets.noData'));
      return;
    }

    const topPrices = filteredPrices.slice(0, 5);
    const summary = `${t('markets.currentPrices')}: ${topPrices
      .map(
        (p: MarketPrice | StaticMarketPrice) =>
          `${p.commodity} ${t('markets.at')} ${p.market} ${t('markets.is')} ${p.price} ${t('markets.rupees')} ${t('markets.per')} ${p.unit}, ${
            p.trend === "up"
              ? `${t('markets.increasing')} ${t('markets.by')} ${p.change} ${t('markets.percent')}`
              : p.trend === "down"
              ? `${t('markets.decreasing')} ${t('markets.by')} ${Math.abs(p.change)} ${t('markets.percent')}`
              : t('markets.stable')
          }`
      )
      .join(". ")}. ${t('markets.total')} ${filteredPrices.length} ${t('markets.commoditiesListed')}.`;

    speakText(summary);
  };

  const handleSpeakPrice = (price: MarketPrice | StaticMarketPrice, index: number) => {
    const text = `${price.commodity} ${t('markets.at')} ${price.market}, ${price.state}. ${t('markets.currentPrice')} ${t('markets.is')} ${price.price} ${t('markets.rupees')} ${t('markets.per')} ${price.unit}. ${t('markets.trend')} ${t('markets.is')} ${
      price.trend === "up"
        ? `${t('markets.increasing')} ${t('markets.with')} ${price.change} ${t('markets.percent')} ${t('markets.increase')}`
        : price.trend === "down"
        ? `${t('markets.decreasing')} ${t('markets.with')} ${Math.abs(price.change)} ${t('markets.percent')} ${t('markets.decrease')}`
        : t('markets.stable')
    }. ${t('markets.updated')} ${new Date(price.date).toLocaleDateString(i18n.language === 'en' ? "en-IN" : "hi-IN")}.`;

    speakText(text, index);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-3">{t('markets.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('markets.subtitle')}
          </p>
          {useFallbackMode && (
            <Badge variant="outline" className="mt-3 text-sm">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t('markets.fallbackMode') || "API not working — showing static mandi prices for today"}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {speakingIndex !== null && (
            <Button
              variant="destructive"
              size="lg"
              onClick={stopSpeaking}
            >
              <StopCircle className="mr-2 h-5 w-5" />
              {t('markets.stopSpeaking') || "Stop"}
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={handleSpeakSummary}
            disabled={speakingIndex !== null}
          >
            <Volume2 className="mr-2 h-5 w-5" />
            {t('markets.hearSummary')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('markets.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg h-14"
          />
        </div>
      </div>

      {/* Price Chart */}
      {chartData && chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('markets.priceOverview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Price List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{t('markets.currentPrices')}</h2>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredPrices && filteredPrices.length > 0 ? (
            filteredPrices.map((price: MarketPrice | StaticMarketPrice, idx: number) => (
              <Card key={idx} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">
                        {price.commodity}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {price.market}, {price.state}
                      </p>
                      {'minPrice' in price && 'maxPrice' in price && price.minPrice && price.maxPrice && (
                        <p className="text-sm text-muted-foreground">
                          {t('markets.range')}: ₹{price.minPrice} - ₹{price.maxPrice}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('markets.updated')}: {new Date(price.date).toLocaleDateString(i18n.language === 'en' ? "en-IN" : "hi-IN")}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-3">
                      <div>
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <span className="text-3xl font-bold">
                            ₹{price.price}
                          </span>
                          <span className="text-lg text-muted-foreground">/{price.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          {price.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : price.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-500" />
                          )}
                          <Badge
                            variant={price.trend === "up" ? "default" : price.trend === "down" ? "destructive" : "secondary"}
                            className="text-sm"
                          >
                            {price.change > 0 ? "+" : ""}
                            {price.change}%
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeakPrice(price, idx)}
                        className={speakingIndex === idx ? "bg-primary text-primary-foreground" : ""}
                        disabled={speakingIndex !== null && speakingIndex !== idx}
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        {speakingIndex === idx ? t('common.speaking') || "Speaking..." : t('common.speak')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {searchTerm ? t('markets.noResults') : t('common.noData')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
