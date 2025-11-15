import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PenTool, Save, Loader2, Volume2, Copy, FileText } from "lucide-react";
import type { Draft } from "@shared/schema";

const draftTypes = [
  { value: "application", label: "Job/Scheme Application" },
  { value: "letter", label: "Formal Letter" },
  { value: "complaint", label: "Complaint/Grievance" },
  { value: "request", label: "Request Letter" },
  { value: "certificate", label: "Certificate Request" },
];

export default function DraftGenerator() {
  const [draftType, setDraftType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const { data: recentDrafts } = useQuery<Draft[]>({
    queryKey: ["/api/drafts"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { draftType: string; purpose: string }) => {
      return apiRequest("POST", "/api/drafts/generate", data);
    },
    onSuccess: (data: any) => {
      setGeneratedContent(data.content);
      setTitle(data.title);
      toast({
        title: "Draft Generated",
        description: "Your draft is ready. You can edit and save it.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not generate draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; draftType: string; content: string; purpose: string }) => {
      return apiRequest("POST", "/api/drafts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({
        title: "Draft Saved",
        description: "Your draft has been saved successfully",
      });
      setGeneratedContent("");
      setTitle("");
      setPurpose("");
      setDraftType("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save draft.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ draftType, purpose });
  };

  const handleSave = () => {
    if (title && generatedContent) {
      saveMutation.mutate({ title, draftType, content: generatedContent, purpose });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied",
      description: "Draft copied to clipboard",
    });
  };

  const handleSpeak = () => {
    // TTS implementation
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Draft Generator</h1>
        <p className="text-lg text-muted-foreground">
          AI-powered drafting for applications, letters, and official documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Generate New Draft</CardTitle>
              <CardDescription className="text-base">
                Describe what you need and AI will create it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="draftType" className="text-base">Document Type</Label>
                <Select value={draftType} onValueChange={setDraftType} required>
                  <SelectTrigger id="draftType" className="h-12 text-base" data-testid="select-draft-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {draftTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-base">Purpose / Details</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Example: I need a leave application for 3 days due to family emergency"
                  className="min-h-[150px] text-base"
                  data-testid="textarea-purpose"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!draftType || !purpose || generateMutation.isPending}
                size="lg"
                className="w-full h-14 text-lg"
                data-testid="button-generate-draft"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-5 w-5" />
                    Generate Draft
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Drafts */}
          {recentDrafts && recentDrafts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDrafts.slice(0, 5).map((draft) => (
                    <div
                      key={draft.id}
                      className="p-4 bg-muted/50 rounded-md hover-elevate cursor-pointer"
                      onClick={() => {
                        setGeneratedContent(draft.content);
                        setTitle(draft.title);
                        setDraftType(draft.draftType);
                      }}
                      data-testid={`card-draft-${draft.id}`}
                    >
                      <h4 className="font-semibold mb-1">{draft.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {draftTypes.find(t => t.value === draft.draftType)?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          v{draft.version}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Section */}
        <div>
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Generated Draft</CardTitle>
                <CardDescription className="text-base">
                  Edit as needed and save
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for this draft"
                    className="h-12 text-base"
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">Content</Label>
                  <Textarea
                    id="content"
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[400px] text-base font-mono"
                    data-testid="textarea-content"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending || !title}
                    size="lg"
                    className="flex-1"
                    data-testid="button-save-draft"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="lg"
                    data-testid="button-copy-draft"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleSpeak}
                    variant="outline"
                    size="lg"
                    data-testid="button-speak-draft"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
