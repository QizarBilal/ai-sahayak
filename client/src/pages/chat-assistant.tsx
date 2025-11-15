import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MicrophoneButton } from "@/components/microphone-button";
import { AudioPlayer } from "@/components/audio-player";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, Loader2 } from "lucide-react";
import type { Conversation, Message } from "@shared/schema";

export default function ChatAssistant() {
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; mode: string }) => {
      return apiRequest("POST", "/api/chat", {
        message: data.content,
        mode: data.mode,
        conversationId: currentConversationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setInputText("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessageMutation.mutate({ content: inputText, mode: "text" });
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In real implementation, send audio blob for transcription
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Chat Assistant</h1>
        <p className="text-lg text-muted-foreground">
          Have a conversation in text or voice mode
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100%-8rem)]">
        {/* Conversations List */}
        <div className="w-64 shrink-0">
          <Card className="h-full">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-4">Conversations</h2>
              <ScrollArea className="h-[calc(100%-3rem)]">
                <div className="space-y-2">
                  {conversations?.map((conv) => (
                    <Button
                      key={conv.id}
                      variant={currentConversationId === conv.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentConversationId(conv.id)}
                      data-testid={`button-conversation-${conv.id}`}
                    >
                      <div className="truncate text-left">
                        <div className="font-medium truncate">{conv.title}</div>
                        <div className="text-xs opacity-70">{conv.mode} mode</div>
                      </div>
                    </Button>
                  ))}
                  {(!conversations || conversations.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No conversations yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "text" | "voice")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" data-testid="tab-text-mode">Text Mode</TabsTrigger>
              <TabsTrigger value="voice" data-testid="tab-voice-mode">Voice Mode</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4 mb-6">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                          {msg.audioUrl && (
                            <div className="mt-3">
                              <AudioPlayer audioUrl={msg.audioUrl} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-lg text-muted-foreground mb-2">
                        Start a conversation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mode === "voice"
                          ? "Press the microphone to speak"
                          : "Type your message below"}
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              {mode === "text" ? (
                <form onSubmit={handleSendText} className="flex gap-3">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 h-12 text-base"
                    data-testid="input-message"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={sendMessageMutation.isPending || !inputText.trim()}
                    data-testid="button-send-message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <div className="flex justify-center">
                  <MicrophoneButton
                    isRecording={isRecording}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
                    size="large"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
