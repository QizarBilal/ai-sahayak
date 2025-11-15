import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AudioPlayer } from "@/components/audio-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { VoiceQuery } from "@shared/schema";

export default function RecentQueries() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: queries, isLoading } = useQuery<VoiceQuery[]>({
    queryKey: ["/api/queries"],
  });

  const filteredQueries = queries?.filter(
    (q) =>
      q.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Recent Queries</h1>
        <p className="text-lg text-muted-foreground">
          View your voice conversation history with playback
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg h-14"
            data-testid="input-search-queries"
          />
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-6">
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
          filteredQueries.map((query) => (
            <Card key={query.id} data-testid={`card-query-${query.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">Conversation</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">You asked:</h3>
                  <p className="text-base bg-muted/50 p-4 rounded-md" data-testid="text-query-transcript">
                    {query.transcript}
                  </p>
                  {query.audioUrl && (
                    <AudioPlayer audioUrl={query.audioUrl} />
                  )}
                </div>

                {/* Response */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">AI responded:</h3>
                  <p className="text-base bg-primary/5 p-4 rounded-md" data-testid="text-query-response">
                    {query.response}
                  </p>
                  {query.responseAudioUrl && (
                    <AudioPlayer audioUrl={query.responseAudioUrl} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                {searchTerm
                  ? "No queries match your search"
                  : "No queries yet. Start a conversation with the Voice Assistant!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
