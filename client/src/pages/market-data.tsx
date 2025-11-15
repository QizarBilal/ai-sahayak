import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Volume2 } from "lucide-react";
import { useState } from "react";
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
  unit: string;
  date: string;
  trend: "up" | "down" | "stable";
  change: number;
}

export default function MarketData() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: marketPrices, isLoading } = useQuery<MarketPrice[]>({
    queryKey: ["/api/markets"],
  });

  const filteredPrices = marketPrices?.filter(
    (p) =>
      p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = marketPrices?.slice(0, 7).map((p, idx) => ({
    name: p.commodity.substring(0, 10),
    price: p.price,
    index: idx,
  }));

  const handleSpeakSummary = async () => {
    // Voice synthesis for market summary
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-3">Market Data</h1>
          <p className="text-lg text-muted-foreground">
            Live mandi prices and agricultural commodity trends
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleSpeakSummary}
          data-testid="button-speak-summary"
        >
          <Volume2 className="mr-2 h-5 w-5" />
          Hear Summary
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search commodities or markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg h-14"
            data-testid="input-search-markets"
          />
        </div>
      </div>

      {/* Price Chart */}
      {chartData && chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Price Overview</CardTitle>
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
        <h2 className="text-2xl font-bold mb-6">Current Prices</h2>
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
            filteredPrices.map((price, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-price-${idx}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1" data-testid={`text-commodity-${idx}`}>
                        {price.commodity}
                      </h3>
                      <p className="text-muted-foreground">
                        {price.market}, {price.state}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-3xl font-bold" data-testid={`text-price-${idx}`}>
                          ₹{price.price}
                        </span>
                        <span className="text-lg text-muted-foreground">/{price.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        {price.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : price.trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : null}
                        <Badge
                          variant={price.trend === "up" ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {price.change > 0 ? "+" : ""}
                          {price.change}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {searchTerm ? "No markets match your search" : "Loading market data..."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
