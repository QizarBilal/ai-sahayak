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

// Static draft templates with comprehensive coverage
const STATIC_DRAFT_TEMPLATES: Record<string, { title: string; content: string }> = {
  application: {
    title: "Job/Scheme Application Letter",
    content: `To,
The [Officer Designation/HR Manager],
[Department/Organization Name],
[Complete Address],
[City, State] - [PIN Code]

Subject: Application for [Job Position/Scheme Name]

Respected Sir/Madam,

I, [Your Full Name], son/daughter of [Father's Name], aged [Age] years, residing at [Full Address], would like to submit my application for [Job Position/Scheme Name] as advertised on [Date/Source].

Personal Details:
- Name: [Full Name]
- Date of Birth: [DD/MM/YYYY]
- Age: [Age] years
- Gender: [Male/Female/Other]
- Address: [Full Address]
- Mobile: [10-digit number]
- Email: [email@example.com]
- Aadhaar Number: [XXXX XXXX XXXX]

Educational Qualifications:
- [Highest Degree]: [University Name], [Year], [Percentage/CGPA]
- [Previous Degree]: [University Name], [Year], [Percentage/CGPA]

Work Experience (if any):
- [Job Title] at [Company Name], [Duration]
- [Responsibilities and achievements]

Skills:
[List relevant skills - computer skills, language proficiency, technical skills, etc.]

I believe I fulfill all the eligibility criteria for this [position/scheme] and would be grateful for the opportunity to [contribute to your organization/benefit from this scheme]. I am available for an interview at your convenience.

Enclosed Documents:
1. Resume/Biodata (1 page)
2. Educational certificates (attested copies)
3. Experience certificates (if applicable)
4. Aadhaar Card copy
5. Passport size photographs (2 nos.)
6. [Any other required documents]

I request you to kindly consider my application and grant me an opportunity.

Thanking you in anticipation,

Yours faithfully,
[Your Full Name]
[Signature]
[Date: DD/MM/YYYY]

Enclosures: As mentioned above`,
  },
  letter: {
    title: "Formal Letter",
    content: `From,
[Your Full Name]
[Your Complete Address]
[City, State] - [PIN Code]
[Mobile Number]
[Email Address]

To,
[Recipient Name]
[Recipient Designation]
[Organization/Department Name]
[Complete Address]
[City, State] - [PIN Code]

Date: [DD/MM/YYYY]

Subject: [Clear and concise subject line]

Respected Sir/Madam,

I, [Your Full Name], resident of [Area/Village/City], would like to bring to your kind attention [state the purpose of the letter].

[First Paragraph: Introduction and context]
I am writing this letter to [purpose]. As a [your status - resident/citizen/member], I have [reason/background].

[Second Paragraph: Main content/details]
[Provide detailed information, facts, dates, and specific points you want to communicate. Be clear and specific.]

[Third Paragraph: Request/Action needed]
In view of the above, I kindly request you to [state clearly what you want - approval, action, consideration, etc.]. This would [explain the benefit/outcome].

I am enclosing the following documents for your reference:
1. [Document 1]
2. [Document 2]
3. [Document 3]

I shall be highly obliged for your kind consideration and prompt action on this matter. I am available for any further clarification.

Thanking you for your time and attention.

Yours faithfully,
[Your Full Name]
[Your Signature]

Enclosures: As mentioned`,
  },
  complaint: {
    title: "Complaint/Grievance Letter",
    content: `To,
The [Officer Designation - Tahsildar/Commissioner/Superintendent],
[Department Name - Municipality/Police Department/Public Works],
[Office Address],
[City, District, State] - [PIN Code]

Subject: Grievance/Complaint regarding [Brief Issue - Road Damage/Water Supply/Electricity/Public Nuisance]

Respected Sir/Madam,

I, [Your Full Name], son/daughter of [Father's Name], residing at [Full Address with Landmark], [Village/Town/City], would like to lodge a formal complaint regarding [specific issue].

Details of the Complaint:

1. Nature of Issue:
[Describe the problem in detail - what is happening, since when, frequency, severity]

2. Location:
[Exact location with landmarks - Street name, area, nearby notable places]

3. Timeline:
- Issue started on: [Date]
- Frequency: [Daily/Weekly/Occasionally]
- Duration: [How long this has been continuing]

4. Impact on Public/Personal Life:
[Explain how this issue is affecting you, your family, or the community]
- Health impact: [if any]
- Financial impact: [if any]
- Inconvenience caused: [describe]

5. Previous Complaints/Actions Taken:
- Complaint registered on [Date] with [Department/Person]
- Reference Number (if any): [Number]
- Current status: [Pending/No action taken]

Details of Incident (if applicable):
- Date and Time: [DD/MM/YYYY at HH:MM AM/PM]
- Persons involved: [Names/Descriptions if known]
- Witnesses: [Names and contacts if any]

Expected Resolution:
I request you to kindly:
1. [Specific action 1 - e.g., repair the road, restore water supply]
2. [Specific action 2 - e.g., take action against responsible parties]
3. [Specific action 3 - e.g., provide compensation if applicable]

Supporting Evidence:
1. Photographs of the issue (attached)
2. Previous complaint copy
3. Medical bills (if applicable)
4. Witness statements (if any)

I request your immediate intervention and resolution of this matter at the earliest. This issue is causing significant hardship to [number] families in our area.

I am available at the below contact details for any site visit, verification, or further information:
Mobile: [Your 10-digit number]
Email: [Your email]

I look forward to swift action and a positive resolution.

Thanking you,

Yours faithfully,
[Your Full Name]
[Full Address]
[Contact Number]
[Date: DD/MM/YYYY]

Enclosures:
1. Photographs (if any)
2. Previous complaint copy
3. Supporting documents`,
  },
  request: {
    title: "Request Letter",
    content: `To,
[Recipient Name/Designation]
[Organization/Department Name]
[Complete Address]
[City, State] - [PIN Code]

Subject: Request for [Specific Item/Service/Permission/Certificate]

Respected Sir/Madam,

I, [Your Full Name], resident of [Full Address], would like to submit a humble request for [state what you need].

Purpose of Request:
I am in need of [item/service/permission/certificate] for the following purpose:
[Explain why you need this - education, employment, travel, legal requirement, etc.]

Background/Justification:
[Provide relevant background information that supports your request]
[Explain any special circumstances or urgency]

Details:
- Required by date: [DD/MM/YYYY]
- Purpose: [Detailed purpose]
- Validity period (if applicable): [Duration]

Personal Details:
- Name: [Full Name]
- Address: [Complete Address]
- Contact: [Phone Number]
- Email: [Email Address]
- Aadhaar Number: [XXXX XXXX XXXX]

I have enclosed the following documents to support my request:
1. Identity Proof (Aadhaar Card copy)
2. Address Proof (Ration Card/Electricity Bill)
3. [Any specific documents required]
4. Application fee receipt (if applicable)

I kindly request you to consider my application favorably and [grant permission/issue certificate/provide service] at the earliest convenience.

I assure you that [any commitments or assurances relevant to the request].

I shall be highly grateful for your kind consideration.

Thanking you in advance,

Yours faithfully,
[Your Full Name]
[Your Signature]
[Contact Number]
[Date: DD/MM/YYYY]

Enclosures: As mentioned above`,
  },
  certificate: {
    title: "Certificate Request Application",
    content: `To,
The [Issuing Authority - Tahsildar/Village Officer/School Principal],
[Office Name/School Name],
[Complete Address],
[District, State] - [PIN Code]

Subject: Application for [Name of Certificate] Certificate

Respected Sir/Madam,

I, [Your Full Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, residing at [Full Address], would like to apply for a [Type of Certificate] Certificate.

Purpose of Certificate:
This certificate is required for [Purpose - educational admission, job application, government scheme, visa, loan, etc.].

Personal Details:
- Full Name: [As per Aadhaar]
- Date of Birth: [DD/MM/YYYY]
- Age: [Age] years
- Gender: [Male/Female]
- Father's Name: [Full Name]
- Mother's Name: [Full Name]
- Permanent Address: [Full Address]
- Mobile Number: [10-digit number]
- Email: [Email address]
- Aadhaar Number: [XXXX XXXX XXXX]

Additional Details (if applicable):
[Provide specific details relevant to the certificate type]

Required Documents Enclosed:
1. Application form (duly filled and signed)
2. Self-attested copy of Aadhaar Card
3. Self-attested copy of Ration Card
4. Passport size photographs (2 nos.)
5. Address proof (Electricity bill/Voter ID)
6. [Certificate-specific documents]
7. Application fee receipt (if applicable)

I hereby declare that all the information provided above is true and correct to the best of my knowledge. I request you to kindly verify the details and issue the [Certificate Name] at the earliest.

I shall be highly obliged for your prompt action on this application.

Thanking you,

Yours faithfully,
[Your Full Name]
[Your Signature]
[Date: DD/MM/YYYY]

Enclosures:
1. Application form
2. Aadhaar Card copy
3. Ration Card copy
4. Photographs
5. Other supporting documents`,
  },
  income_certificate: {
    title: "Income Certificate Application",
    content: `To,
The Tahsildar,
Taluk Office,
[Taluk Name],
[District Name],
[State Name] - [PIN Code]

Subject: Application for Income Certificate

Respected Sir/Madam,

I, [Your Full Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, permanently residing at [Full Address], [Village/Town], [Taluk], [District], [State] - [PIN Code], would like to submit an application for an Income Certificate.

Purpose of Income Certificate:
This certificate is required for [Select Purpose]:
□ Educational scholarship application
□ Fee concession
□ Government scheme benefit (specify: _________)
□ Educational loan
□ Admission to educational institution
□ Other (specify: _________)

Family Details and Income Information:

1. Father/Guardian Details:
   - Name: [Full Name]
   - Occupation: [Occupation]
   - Monthly Income: Rs. [Amount]
   - Annual Income: Rs. [Amount]

2. Mother's Details:
   - Name: [Full Name]
   - Occupation: [Occupation/Housewife]
   - Monthly Income: Rs. [Amount]
   - Annual Income: Rs. [Amount]

3. Self Income (if employed):
   - Occupation: [Occupation/Student]
   - Monthly Income: Rs. [Amount]
   - Annual Income: Rs. [Amount]

Total Family Annual Income: Rs. [Total Amount]

Income Sources Breakdown:
1. Salary/Wages: Rs. [Amount] per annum
2. Agricultural Income: Rs. [Amount] per annum
3. Business Income: Rs. [Amount] per annum
4. Other Income: Rs. [Amount] per annum

Total: Rs. [Total Amount] per annum

Family Members:
1. [Name] - [Relation] - [Age] - [Occupation]
2. [Name] - [Relation] - [Age] - [Occupation]
3. [Name] - [Relation] - [Age] - [Occupation]

I hereby declare that the above information is true and correct to the best of my knowledge. Our family's total annual income from all sources does not exceed Rs. [Amount].

Documents Enclosed:
1. Self-attested copy of Aadhaar Card (Applicant)
2. Self-attested copy of Ration Card (Family)
3. Salary slips/Income proof (last 3 months)
4. Employer certificate (if employed)
5. Agricultural income certificate (if applicable)
6. Bank passbook copy (last 6 months statement)
7. Address proof (Electricity bill/Water bill)
8. Passport size photographs (2 nos.)
9. Self-declaration affidavit

I request you to kindly verify the above details through the Revenue Inspector and Village Administrative Officer, and issue an Income Certificate at the earliest for the stated purpose.

I am available for any field verification or inquiry.

Thanking you in anticipation of early action,

Yours faithfully,
[Your Full Name]
[Your Signature]
[Mobile Number]
[Date: DD/MM/YYYY]

Applicant's Contact Details:
Mobile: [10-digit number]
Email: [Email address]
Alternative Contact: [Number]

Enclosures: As mentioned above (Total: ___ documents)`,
  },
  community_certificate: {
    title: "Community Certificate Application",
    content: `To,
The Tahsildar,
Taluk Office,
[Taluk Name],
[District Name],
[State Name] - [PIN Code]

Subject: Application for Community Certificate (Caste Certificate)

Respected Sir/Madam,

I, [Your Full Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, permanently residing at [Full Address], [Village/Town], [Taluk], [District], [State] - [PIN Code], belonging to [Community Name] community, would like to submit an application for a Community Certificate.

Purpose of Community Certificate:
This certificate is required for [Select Purpose]:
□ Educational admission (College/University)
□ Scholarship application
□ Government job application
□ Reservation benefits
□ Competitive examination
□ Other (specify: _________)

Applicant's Details:
- Full Name: [As per Aadhaar]
- Date of Birth: [DD/MM/YYYY]
- Age: [Age] years
- Gender: [Male/Female]
- Community: [SC/ST/OBC/MBC - specify subcaste]
- Religion: [Religion]
- Nationality: Indian
- Marital Status: [Married/Unmarried]

Father's Details:
- Name: [Full Name]
- Community: [Same as applicant]
- Occupation: [Occupation]
- Native Place: [Village/Town, District]

Mother's Details:
- Name: [Full Name]
- Maiden Community: [Community]
- Father's Name (Maternal Grandfather): [Name]
- Native Place: [Village/Town, District]

Residential Details:
- Present Address: [Full Address]
- Permanent Address: [Full Address]
- Duration of Residence: [Number of years]
- Village/Town: [Name]
- Taluk: [Name]
- District: [Name]
- State: [Name]

Community Background:
Our family has been belonging to [Community Name] community for generations. We have been permanent residents of [Village/Town] for [Number] years. Our ancestors have been living in this region and following the customs and traditions of [Community Name] community.

Previous Certificates (if any):
- Father's Community Certificate Number: [Number] (issued on [Date])
- Sibling's Certificate Number (if any): [Number]
- [Any other family member's certificate details]

Educational Details:
- School/College Name: [Name]
- Class/Year: [Current class/year]
- School Community Certificate: [Yes/No]

Documents Enclosed:
1. Self-attested copy of Aadhaar Card (Applicant)
2. Self-attested copy of Birth Certificate
3. Self-attested copy of School/College ID Card
4. Self-attested copy of Ration Card (Family)
5. Father's Community Certificate (if available)
6. School Leaving Certificate/Transfer Certificate
7. Residence proof (Electricity bill/Water tax receipt)
8. Passport size photographs (4 nos.)
9. Self-declaration affidavit on stamp paper
10. Previous generation certificates (if available)

Declaration:
I hereby solemnly declare that:
1. I belong to [Community Name] community by birth
2. My father and ancestors belong to the same community
3. Our family has been residing in [District] for generations
4. All information provided is true and correct
5. I have not changed my community/religion
6. I am eligible for community certificate as per government rules

I request you to kindly verify the above details through field verification by the Revenue Inspector and Village Administrative Officer, and issue a Community Certificate at the earliest for the stated purpose.

I am ready to provide any additional information or documents if required. I am also available for personal appearance and field verification at your convenience.

Thanking you for your kind consideration,

Yours faithfully,
[Your Full Name]
[Your Signature]
[Mobile Number]
[Date: DD/MM/YYYY]

Contact Details:
Mobile: [10-digit number]
Email: [Email address]
Alternative Contact: [Number]
Father's Contact: [Number]

Enclosures: As mentioned above (Total: ___ documents)

---
For Office Use Only:
Revenue Inspector's Report: _______________
VAO Verification: _______________
Tahsildar's Remarks: _______________
Certificate Number: _______________
Date of Issue: _______________`,
  },
  leave_letter: {
    title: "Leave Application",
    content: `To,
[Manager's Name/Principal's Name],
[Designation],
[Organization/School Name],
[Address],
[City, State] - [PIN Code]

Subject: Application for [Casual/Medical/Emergency] Leave

Respected Sir/Madam,

I, [Your Full Name], working as [Your Designation] in [Department Name] / studying in [Class/Standard and Section], would like to request leave for [Number] day(s) from [Start Date] to [End Date] ([both dates inclusive/[End Date] inclusive]).

Reason for Leave:
[Select appropriate reason and provide details:]

□ Medical Emergency:
I am suffering from [illness/medical condition] and have been advised by my doctor to take rest for [duration]. I have attached the medical certificate for your reference.

□ Family Emergency/Function:
[Describe the family situation - wedding, funeral, family member illness, urgent family matter, etc.]

□ Personal Work:
[Provide brief explanation of the personal work that requires leave]

□ Other:
[Specify the reason clearly]

Leave Details:
- Leave Type: [Casual Leave/Sick Leave/Emergency Leave]
- Number of Days: [Number]
- From Date: [DD/MM/YYYY]
- To Date: [DD/MM/YYYY]
- Total Working Days: [Number]
- Resuming Work/School on: [DD/MM/YYYY]

Work Handover/Academic Coverage (if applicable):
During my absence:
- [Colleague's Name] will handle my urgent work responsibilities
- My pending work has been completed up to [date]
- I will complete any remaining work immediately upon my return
- For students: I will cover the missed lessons by [attending extra classes/self-study/taking notes from classmates]

Previous Leave Record (if required):
- Last leave taken: [Date] for [Number] days
- Total leaves taken this [month/year]: [Number] days
- Available leave balance: [Number] days

Contact During Leave:
I can be reached at:
- Mobile: [10-digit number]
- Email: [Email address]
- Emergency Contact: [Alternative number]

Documents Attached (if applicable):
1. Medical certificate (for medical leave)
2. [Doctor's prescription/Hospital bill]
3. [Other supporting documents]

I kindly request you to grant me leave for the mentioned period. I shall be highly obliged and grateful for your approval.

I assure you that I will resume my duties/studies promptly on [Return Date] and complete any pending work at the earliest.

Thank you for your understanding and consideration.

Yours sincerely,
[Your Full Name]
[Your Signature]
[Employee ID/Roll Number]
[Department/Class]
[Contact Number]
[Date: DD/MM/YYYY]

---
For Office Use Only:
Recommended by: _______________
Approved by: _______________
Date: _______________`,
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
