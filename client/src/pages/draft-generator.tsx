import { useState, useRef, useEffect } from "react";
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
import { PenTool, Save, Loader2, Volume2, Copy, FileText, AlertCircle, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Draft } from "@shared/schema";

const draftTypes = [
  { value: "application", label: "Job/Scheme Application" },
  { value: "letter", label: "Formal Letter" },
  { value: "complaint", label: "Complaint/Grievance" },
  { value: "request", label: "Request Letter" },
  { value: "certificate", label: "Certificate Request" },
  { value: "income_certificate", label: "Income Certificate Application" },
  { value: "community_certificate", label: "Community Certificate Application" },
  { value: "leave_letter", label: "Leave Letter" },
];

// Static draft templates
const STATIC_DRAFT_TEMPLATES: Record<string, { title: string; content: string }> = {
  income_certificate: {
    title: "Application for Income Certificate",
    content: `To,
The Tahsildar,
[Taluk Name],
[District Name],
[State Name] - [PIN Code]

Subject: Application for Income Certificate

Respected Sir/Madam,

I, [Your Full Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, residing at [Full Address], would like to apply for an Income Certificate for the purpose of [Purpose - e.g., educational scholarship, government scheme application].

My family's annual income from all sources is approximately Rs. [Amount] per annum. The details of income sources are as follows:

1. [Income Source 1]: Rs. [Amount]
2. [Income Source 2]: Rs. [Amount]

I request you to kindly issue an Income Certificate at the earliest. I have attached the following documents for your reference:

1. Aadhaar Card copy
2. Ration Card copy
3. Salary slips/Income proof
4. Address proof

Thanking you in anticipation.

Yours faithfully,
[Your Full Name]
[Contact Number]
[Date]

Enclosures:
1. Self-attested copy of Aadhaar Card
2. Self-attested copy of Ration Card
3. Income proof documents`,
  },
  community_certificate: {
    title: "Application for Community Certificate",
    content: `To,
The Tahsildar,
[Taluk Name],
[District Name],
[State Name] - [PIN Code]

Subject: Application for Community Certificate

Respected Sir/Madam,

I, [Your Full Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, residing at [Full Address], belong to [Community Name - SC/ST/OBC/MBC] community.

I hereby request you to issue a Community Certificate for the purpose of [Purpose - e.g., educational admission, government job application, scholarship].

My family has been residing in this area for [Number] years, and we belong to the [Community Name] community as per government records.

I have attached the following documents for verification:

1. Aadhaar Card copy
2. Ration Card copy
3. School/College certificates
4. Family community certificate (if available)

I request you to kindly verify the details and issue the Community Certificate at the earliest.

Thanking you for your kind consideration.

Yours faithfully,
[Your Full Name]
[Contact Number]
[Date]

Enclosures:
1. Self-attested copy of Aadhaar Card
2. Self-attested copy of Ration Card
3. Educational certificates`,
  },
  complaint: {
    title: "Grievance Petition",
    content: `To,
The [Officer Designation],
[Department Name],
[Office Address],
[City, State] - [PIN Code]

Subject: Grievance regarding [Brief Issue Description]

Respected Sir/Madam,

I, [Your Full Name], resident of [Full Address], would like to bring to your kind attention the following grievance:

Issue Description:
[Describe the issue in detail - what happened, when it happened, where it happened, and who is involved]

Impact:
[Explain how this issue is affecting you or your community]

Previous Actions Taken:
1. [Action 1] on [Date]
2. [Action 2] on [Date]

Expected Resolution:
[Clearly state what you expect as a resolution to this issue]

I request your immediate intervention in this matter and seek a resolution at the earliest. I am available for any further clarification or documentation required.

Supporting Documents:
1. [Document 1]
2. [Document 2]

I look forward to a positive response and swift action.

Thanking you,

Yours faithfully,
[Your Full Name]
[Contact Number]
[Email Address]
[Date]`,
  },
  leave_letter: {
    title: "Leave Application",
    content: `To,
[Manager/Principal Name],
[Designation],
[Organization/School Name],
[City]

Subject: Application for Leave

Respected Sir/Madam,

I, [Your Full Name], [your designation/class and section], would like to request leave for [number] days from [Start Date] to [End Date].

Reason for Leave:
[Provide the reason - medical emergency, family function, personal work, etc.]

During my absence, [if applicable - mention any arrangement made for pending work or coverage].

I kindly request you to grant me leave for the mentioned period. I shall be highly grateful for your approval.

Thank you for your understanding and consideration.

Yours sincerely,
[Your Full Name]
[Employee ID/Roll Number]
[Contact Number]
[Date]`,
  },
  application: {
    title: "Job/Scheme Application",
    content: `To,
The [Officer Designation],
[Department/Organization Name],
[Address],
[City, State] - [PIN Code]

Subject: Application for [Job Position/Scheme Name]

Respected Sir/Madam,

I, [Your Full Name], would like to apply for [Job Position/Scheme Name] as advertised/announced on [Date/Source].

Personal Details:
- Name: [Full Name]
- Age: [Age]
- Address: [Full Address]
- Contact: [Phone Number]
- Email: [Email Address]

Qualifications:
- Education: [Highest Qualification]
- Experience: [Years of Experience]
- Skills: [Relevant Skills]

I believe I meet all the eligibility criteria for this [position/scheme] and would be grateful for the opportunity to [contribute/benefit].

I have enclosed the following documents:
1. Resume/Biodata
2. Educational certificates
3. Experience certificates
4. Identity proof

I look forward to a favorable response.

Thanking you,

Yours faithfully,
[Your Full Name]
[Date]`,
  },
};

export default function DraftGenerator() {
  const [draftType, setDraftType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [title, setTitle] = useState("");
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { data: recentDrafts } = useQuery<Draft[]>({
    queryKey: ["/api/drafts"],
  });

  const { t, i18n } = useTranslation();

  const generateMutation = useMutation({
    mutationFn: async (data: { draftType: string; purpose: string }) => {
      return apiRequest("POST", "/api/drafts/generate", data);
    },
    onSuccess: (data: any) => {
      setGeneratedContent(data.content);
      setTitle(data.title);
      setUseFallbackMode(false);
      toast({
        title: t('drafts.draftGenerated'),
        description: t('drafts.draftReady'),
      });
    },
    onError: () => {
      // Static fallback
      setUseFallbackMode(true);
      const template = STATIC_DRAFT_TEMPLATES[draftType] || STATIC_DRAFT_TEMPLATES.application;
      setGeneratedContent(template.content);
      setTitle(template.title);
      toast({
        title: t('drafts.fallbackMode') || "API not working",
        description: t('drafts.staticTemplate') || "Generating official-style fallback draft",
        variant: "default",
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
        title: t('drafts.draftSaved'),
        description: t('drafts.savedSuccessfully'),
      });
      setGeneratedContent("");
      setTitle("");
      setPurpose("");
      setDraftType("");
      setUseFallbackMode(false);
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('drafts.saveError'),
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (draftType && purpose) {
      generateMutation.mutate({ draftType, purpose });
    }
  };

  const handleSave = () => {
    if (title && generatedContent) {
      saveMutation.mutate({ title, draftType, content: generatedContent, purpose: purpose || "General purpose" });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: t('common.copied'),
      description: t('drafts.copiedToClipboard'),
    });
  };

  const speakText = () => {
    if (!generatedContent) {
      toast({
        title: t('drafts.noContent'),
        description: t('drafts.noContentDesc'),
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(generatedContent);
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
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">{t('drafts.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('drafts.subtitle')}
            </p>
            {useFallbackMode && (
              <Badge variant="outline" className="mt-3 text-sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t('drafts.fallbackMode') || "API not working — generating official-style fallback draft"}
              </Badge>
            )}
          </div>
          {isSpeaking && (
            <Button variant="destructive" size="sm" onClick={stopSpeaking}>
              <StopCircle className="mr-2 h-4 w-4" />
              {t('drafts.stopSpeaking') || "Stop"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('drafts.generateNew')}</CardTitle>
              <CardDescription className="text-base">
                {t('drafts.describeNeeds')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="draftType" className="text-base">{t('drafts.documentType')}</Label>
                <Select value={draftType} onValueChange={setDraftType} required>
                  <SelectTrigger id="draftType" className="h-12 text-base">
                    <SelectValue placeholder={t('drafts.selectDocumentType')} />
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
                <Label htmlFor="purpose" className="text-base">{t('drafts.purpose')}</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={t('drafts.purposePlaceholder')}
                  className="min-h-[120px] text-base"
                  rows={5}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!draftType || !purpose || generateMutation.isPending}
                size="lg"
                className="w-full h-14 text-lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('drafts.generating')}
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-5 w-5" />
                    {t('drafts.generateDraft')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('drafts.generatedDraft')}</CardTitle>
                <CardDescription className="text-base">
                  {t('drafts.editAndSave')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">{t('drafts.draftTitle')}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('drafts.enterTitle')}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">{t('drafts.content')}</Label>
                  <Textarea
                    id="content"
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[400px] text-base font-mono"
                    rows={20}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleSave}
                    disabled={!title || saveMutation.isPending}
                    size="lg"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('drafts.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        {t('drafts.saveDraft')}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    {t('common.copy')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={speakText}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    {t('drafts.readAloud')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Drafts */}
      {recentDrafts && recentDrafts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('drafts.recentDrafts')}</h2>
          <div className="grid gap-4">
            {recentDrafts.slice(0, 5).map((draft) => (
              <Card key={draft.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <FileText className="h-6 w-6 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{draft.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {draft.draftType} • {draft.purpose}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {draft.content.substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      v{draft.version}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
