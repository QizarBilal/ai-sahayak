import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, FileText, Loader2, Volume2, Languages } from "lucide-react";
import type { Document } from "@shared/schema";

export default function DocumentAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const { toast } = useToast();

  const { data: recentDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("document", file);
      return apiRequest("POST", "/api/documents/analyze", formData);
    },
    onSuccess: (data: any) => {
      setExtractedText(data.extractedText);
      setSummary(data.summary);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Analysis Complete",
        description: "Your document has been processed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not analyze document. Please try again.",
        variant: "destructive",
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
      toast({
        title: "Error",
        description: "Could not translate text.",
        variant: "destructive",
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
      translateMutation.mutate({ text: extractedText, targetLanguage: "hi" });
    }
  };

  const handleSpeak = (text: string) => {
    // TTS implementation
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Document Analyzer</h1>
        <p className="text-lg text-muted-foreground">
          Extract text from images and documents, get AI summaries and translations
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document" className="text-base">Select Image or PDF</Label>
            <div className="flex gap-4">
              <Input
                id="document"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="flex-1 h-12 text-base"
                data-testid="input-document"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzeMutation.isPending}
                size="lg"
                data-testid="button-analyze"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">Selected: {selectedFile.name}</p>
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
            <CardTitle className="text-2xl">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="extracted" data-testid="tab-extracted">
                  <FileText className="mr-2 h-4 w-4" />
                  Extracted Text
                </TabsTrigger>
                <TabsTrigger value="summary" data-testid="tab-summary">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="translation" data-testid="tab-translation">
                  <Languages className="mr-2 h-4 w-4" />
                  Translation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="extracted" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleSpeak(extractedText)}
                    data-testid="button-speak-extracted"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Read Aloud
                  </Button>
                </div>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[300px] text-base"
                  data-testid="textarea-extracted-text"
                />
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleSpeak(summary)}
                    data-testid="button-speak-summary"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Read Aloud
                  </Button>
                </div>
                <div className="p-6 bg-muted/50 rounded-md">
                  <p className="text-base leading-relaxed" data-testid="text-summary">
                    {summary}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="translation" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handleTranslate}
                    disabled={translateMutation.isPending}
                    data-testid="button-translate"
                  >
                    {translateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      "Translate to Hindi"
                    )}
                  </Button>
                  {translation && (
                    <Button
                      variant="outline"
                      onClick={() => handleSpeak(translation)}
                      data-testid="button-speak-translation"
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Read Aloud
                    </Button>
                  )}
                </div>
                {translation && (
                  <div className="p-6 bg-muted/50 rounded-md">
                    <p className="text-base leading-relaxed" data-testid="text-translation">
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
          <h2 className="text-2xl font-bold mb-6">Recent Documents</h2>
          <div className="grid gap-4">
            {recentDocuments.slice(0, 5).map((doc) => (
              <Card key={doc.id} className="hover-elevate" data-testid={`card-document-${doc.id}`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{doc.fileName}</h3>
                      <p className="text-sm text-muted-foreground">{doc.fileType}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Analyzed
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
