import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, FileText, Loader2, ArrowRight, Volume2, AlertCircle, Mic, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { EligibilityCheck } from "@shared/schema";
import { ELIGIBILITY_RULES, type EligibilityRule } from "@/data/generateEligibilityRules";

// Browser Speech APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const schemeCategories = [
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "education", label: "Education & Scholarships" },
  { value: "health", label: "Health & Welfare" },
  { value: "housing", label: "Housing & Infrastructure" },
  { value: "employment", label: "Employment & Skills" },
  { value: "women", label: "Women Empowerment" },
  { value: "senior", label: "Senior Citizens" },
  { value: "pension", label: "Pension Schemes" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

interface StaticEligibilityResult {
  eligible: boolean;
  schemes: Array<{
    name: string;
    status: 'eligible' | 'not_eligible' | 'partial';
    documents: string[];
    nextSteps: string[];
  }>;
}

export default function EligibilityChecker() {
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [state, setState] = useState("");
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const { data: recentChecks } = useQuery<EligibilityCheck[]>({
    queryKey: ["/api/eligibility/history"],
    retry: 1,
  });

  // Initialize Browser Speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        const langMap: { [key: string]: string } = {
          'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
          'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
          'ml': 'ml-IN', 'pa': 'pa-IN'
        };
        recognitionRef.current.lang = langMap[i18n.language] || 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          
          // Fill the active field
          if (activeField === 'age') setAge(text);
          else if (activeField === 'income') setIncome(text);
          else if (activeField === 'occupation') setOccupation(text);
          
          setIsListening(false);
          setActiveField(null);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setActiveField(null);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Static matching logic using 2000+ rules dataset
  const matchEligibilityRules = (userAge: number, userIncome: number, userOccupation: string, userCategory: string): StaticEligibilityResult => {
    try {
      // Normalize category for matching
      const categoryMap: { [key: string]: string } = {
        'agriculture': 'Agriculture',
        'education': 'Education',
        'health': 'Health',
        'housing': 'Housing',
        'employment': 'Employment',
        'women': 'Women & Child Development',
        'senior': 'Senior Citizens',
        'pension': 'Senior Citizens'
      };

      const normalizedCategory = categoryMap[userCategory] || 'Agriculture';
      
      // Filter rules by category
      const categoryRules = ELIGIBILITY_RULES.filter(rule => rule.category === normalizedCategory);
      
      // Find matching rules based on age, income, and occupation
      const matchingRules = categoryRules.filter(rule => {
        const ageMatch = (!rule.ageMin || userAge >= rule.ageMin) && (!rule.ageMax || userAge <= rule.ageMax);
        const incomeMatch = !rule.incomeMax || userIncome <= rule.incomeMax;
        const occupationMatch = !rule.occupations || rule.occupations.length === 0 || 
                                rule.occupations.some(occ => userOccupation.toLowerCase().includes(occ.toLowerCase()));
        
        return ageMatch && incomeMatch && occupationMatch;
      });

      // If exact match found, return first matching rule
      if (matchingRules.length > 0) {
        const bestMatch = matchingRules[0];
        return {
          eligible: true,
          schemes: [{
            name: bestMatch.scheme,
            status: 'eligible',
            documents: bestMatch.requiredDocuments,
            nextSteps: [
              bestMatch.conditions[0],
              'Visit the nearest government office for application',
              'Submit all required documents',
              'Track application status through official portal'
            ]
          }]
        };
      }

      // No exact match - return safe fallback
      return {
        eligible: false,
        schemes: [{
          name: 'No Exact Match Found',
          status: 'not_eligible',
          documents: ['Aadhaar Card', 'Income Certificate', 'Address Proof'],
          nextSteps: [
            'Based on safe fallback processing, no exact match was found.',
            'Please verify your entered details.',
            'Try adjusting age, income, or occupation fields.',
            'Contact nearest government office for personalized assistance.'
          ]
        }]
      };
    } catch (error) {
      console.error('Error matching eligibility rules:', error);
      toast({
        title: t('common.warning') || 'Warning',
        description: 'API not working — using static eligibility dataset.',
        variant: 'destructive',
      });
      
      return generateStaticFallback();
    }
  };

  const checkEligibilityMutation = useMutation({
    mutationFn: async (data: any) => {
      // Try API first
      try {
        return await apiRequest("POST", "/api/eligibility/check", data);
      } catch (apiError) {
        // API failed - use static dataset matching
        throw apiError;
      }
    },
    onSuccess: (data: any) => {
      toast({
        title: t('toasts.success'),
        description: t('eligibility.resultsReady') || "Eligibility results ready",
      });
      
      // Speak the result
      speakResult(data);
    },
    onError: (error: any) => {
      console.error('API eligibility check failed, using static dataset:', error);
      
      // Use static dataset matching
      const userAge = parseInt(age);
      const userIncome = parseInt(income);
      const staticResult = matchEligibilityRules(userAge, userIncome, occupation, category);
      
      checkEligibilityMutation.data = staticResult;
      setUseFallbackMode(true);
      
      toast({
        title: t('common.warning'),
        description: "API not working — using static eligibility dataset.",
        variant: "destructive",
      });
      
      speakResult(staticResult);
    },
  });

  const generateStaticFallback = (): StaticEligibilityResult => {
    // Generate realistic fallback based on category
    const fallbackResults: { [key: string]: StaticEligibilityResult } = {
      'pension': {
        eligible: true,
        schemes: [{
          name: 'National Social Assistance Programme',
          status: 'eligible',
          documents: ['Aadhaar Card', 'Age Proof Certificate', 'Ration Card', 'Bank Account Details'],
          nextSteps: [
            'Visit your Taluk Office or Panchayat Office',
            'Submit application form with required documents',
            'Get acknowledgment receipt',
            'Pension will be credited within 30-45 days'
          ]
        }]
      },
      'agriculture': {
        eligible: true,
        schemes: [{
          name: 'PM-Kisan Samman Nidhi',
          status: 'eligible',
          documents: ['Land Ownership Records', 'Aadhaar Card', 'Bank Account linked to Aadhaar', 'Mobile Number'],
          nextSteps: [
            'Visit PM-Kisan portal or local agriculture office',
            'Fill online application or submit physical form',
            'Verify land records',
            '₹2,000 will be transferred every 4 months'
          ]
        }]
      },
      'education': {
        eligible: true,
        schemes: [{
          name: 'National Scholarship Portal',
          status: 'eligible',
          documents: ['Aadhaar Card', 'Income Certificate', 'Previous Year Mark Sheets', 'Bank Account Details', 'Caste Certificate (if applicable)'],
          nextSteps: [
            'Register on National Scholarship Portal',
            'Fill application with academic details',
            'Upload required documents',
            'Track application status online'
          ]
        }]
      },
      'health': {
        eligible: true,
        schemes: [{
          name: 'Ayushman Bharat - PM-JAY',
          status: 'eligible',
          documents: ['Aadhaar Card', 'Ration Card', 'Address Proof', 'Income Certificate'],
          nextSteps: [
            'Check eligibility on PMJAY website',
            'Visit nearest Common Service Center',
            'Get Ayushman Card issued',
            'Access ₹5 lakh health coverage at empaneled hospitals'
          ]
        }]
      },
      'default': {
        eligible: true,
        schemes: [{
          name: 'General Welfare Scheme',
          status: 'eligible',
          documents: ['Aadhaar Card', 'Address Proof', 'Income Certificate', 'Bank Account Details'],
          nextSteps: [
            'Visit nearest government office',
            'Submit application with documents',
            'Follow up after 15 days',
            'Benefits will be provided as per scheme guidelines'
          ]
        }]
      }
    };

    return fallbackResults[category] || fallbackResults['default'];
  };

  const startVoiceInput = (field: string) => {
    if (!recognitionRef.current) {
      toast({
        title: t('common.error'),
        description: t('eligibility.noSpeechSupport') || "Speech recognition not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setActiveField(field);
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Recognition start error:', error);
      setIsListening(false);
      setActiveField(null);
    }
  };

  const speakResult = (result: any) => {
    if (!synthRef.current) return;

    let textToSpeak = '';
    
    if (result.eligible || (result.schemes && result.schemes[0].status === 'eligible')) {
      const scheme = result.schemes[0];
      textToSpeak = `Eligible for ${scheme.name}. Required documents: ${scheme.documents.join(', ')}. Next steps: ${scheme.nextSteps[0]}`;
    } else {
      textToSpeak = 'Not eligible for selected schemes. Please check other categories.';
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    const langMap: { [key: string]: string } = {
      'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
      'bn': 'bn-IN', 'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN',
      'ml': 'ml-IN', 'pa': 'pa-IN'
    };
    utterance.lang = langMap[i18n.language] || 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkEligibilityMutation.mutate({
      category,
      userDetails: {
        age: parseInt(age),
        income: parseInt(income),
        occupation,
        state,
      },
    });
  };

  const latestCheck = checkEligibilityMutation.data as any;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{t('eligibility.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('eligibility.subtitle')}
        </p>
        {useFallbackMode && (
          <Badge variant="secondary" className="mt-3">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('eligibility.offlineMode') || "Offline Mode - Static Rules"}
          </Badge>
        )}
      </div>

      {/* Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{t('eligibility.checkYourEligibility')}</CardTitle>
          <CardDescription>{t('eligibility.formDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">{t('eligibility.category')}</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('eligibility.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {schemeCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age with Voice Input */}
              <div className="space-y-2">
                <Label htmlFor="age">{t('eligibility.age')}</Label>
                <div className="relative">
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t('eligibility.enterAge')}
                    required
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => startVoiceInput('age')}
                    disabled={isListening && activeField !== 'age'}
                    className={`
                      absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full
                      ${isListening && activeField === 'age' ? 'bg-red-500 text-white animate-pulse' : ''}
                    `}
                  >
                    {isListening && activeField === 'age' ? (
                      <StopCircle className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Income with Voice Input */}
              <div className="space-y-2">
                <Label htmlFor="income">{t('eligibility.annualIncome')}</Label>
                <div className="relative">
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder={t('eligibility.enterIncome')}
                    required
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => startVoiceInput('income')}
                    disabled={isListening && activeField !== 'income'}
                    className={`
                      absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full
                      ${isListening && activeField === 'income' ? 'bg-red-500 text-white animate-pulse' : ''}
                    `}
                  >
                    {isListening && activeField === 'income' ? (
                      <StopCircle className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Occupation with Voice Input */}
              <div className="space-y-2">
                <Label htmlFor="occupation">{t('eligibility.occupation')}</Label>
                <div className="relative">
                  <Input
                    id="occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder={t('eligibility.enterOccupation')}
                    required
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => startVoiceInput('occupation')}
                    disabled={isListening && activeField !== 'occupation'}
                    className={`
                      absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full
                      ${isListening && activeField === 'occupation' ? 'bg-red-500 text-white animate-pulse' : ''}
                    `}
                  >
                    {isListening && activeField === 'occupation' ? (
                      <StopCircle className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* State */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="state">{t('eligibility.state')}</Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('eligibility.selectState')} />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={checkEligibilityMutation.isPending}
              className="w-full"
            >
              {checkEligibilityMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('eligibility.checking')}
                </>
              ) : (
                <>
                  {t('eligibility.checkEligibility')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {latestCheck && (
        <Card className={useFallbackMode ? 'border-yellow-500' : 'border-green-500'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-3">
                {latestCheck.eligible || latestCheck.schemes[0].status === 'eligible' ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    {t('eligibility.eligible')}
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-600" />
                    {t('eligibility.notEligible')}
                  </>
                )}
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => isSpeaking ? stopSpeaking() : speakResult(latestCheck)}
              >
                {isSpeaking ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-1" />
                    {t('common.stop')}
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-1" />
                    {t('eligibility.speakResult')}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {latestCheck.schemes.map((scheme: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={scheme.status === 'eligible' ? 'default' : 'secondary'} className="text-sm">
                    {scheme.name}
                  </Badge>
                  {useFallbackMode && (
                    <Badge variant="outline" className="text-xs">
                      {t('eligibility.staticResult') || 'Static Result'}
                    </Badge>
                  )}
                </div>

                {/* Required Documents */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('eligibility.requiredDocuments')}
                  </h3>
                  <ul className="space-y-2">
                    {scheme.documents.map((doc: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <ArrowRight className="h-5 w-5" />
                    {t('eligibility.nextSteps')}
                  </h3>
                  <ol className="space-y-2">
                    {scheme.nextSteps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="flex-1 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
