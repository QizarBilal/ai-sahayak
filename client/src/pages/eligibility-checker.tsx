import { useState } from "react";
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
import { CheckCircle, XCircle, FileText, Loader2, ArrowRight } from "lucide-react";
import type { EligibilityCheck } from "@shared/schema";

const schemeCategories = [
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "education", label: "Education & Scholarships" },
  { value: "health", label: "Health & Welfare" },
  { value: "housing", label: "Housing & Infrastructure" },
  { value: "employment", label: "Employment & Skills" },
  { value: "women", label: "Women Empowerment" },
  { value: "senior", label: "Senior Citizens" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function EligibilityChecker() {
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [state, setState] = useState("");
  const { toast } = useToast();

  const { data: recentChecks } = useQuery<EligibilityCheck[]>({
    queryKey: ["/api/eligibility/history"],
  });

  const checkEligibilityMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/eligibility/check", data);
    },
    onSuccess: () => {
      toast({
        title: "Eligibility Check Complete",
        description: "Your results are ready below",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not check eligibility. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const latestCheck = checkEligibilityMutation.data as EligibilityCheck | undefined;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Eligibility Checker</h1>
        <p className="text-lg text-muted-foreground">
          Find out which government schemes you qualify for based on your profile
        </p>
      </div>

      {/* Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Check Your Eligibility</CardTitle>
          <CardDescription className="text-base">
            Fill in your details to see which schemes you can apply for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">Scheme Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="h-12 text-base" data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  required
                  className="h-12 text-base"
                  data-testid="input-age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="text-base">Annual Income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter annual income"
                  required
                  className="h-12 text-base"
                  data-testid="input-income"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-base">Occupation</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g., Farmer, Student"
                  required
                  className="h-12 text-base"
                  data-testid="input-occupation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-base">State</Label>
                <Select value={state} onValueChange={setState} required>
                  <SelectTrigger id="state" className="h-12 text-base" data-testid="select-state">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg"
              disabled={checkEligibilityMutation.isPending}
              data-testid="button-check-eligibility"
            >
              {checkEligibilityMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking Eligibility...
                </>
              ) : (
                <>
                  Check Eligibility
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {latestCheck && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              {latestCheck.eligible ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              Eligibility Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Scheme</h3>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {latestCheck.schemeName}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Status</h3>
              <p className="text-base" data-testid="text-eligibility-status">
                {latestCheck.eligibilityReason}
              </p>
            </div>

            {latestCheck.eligible && (
              <>
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {(latestCheck.requiredDocuments as string[]).map((doc, idx) => (
                      <li key={idx} className="text-base">{doc}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ArrowRight className="h-5 w-5" />
                    Next Steps
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {(latestCheck.nextSteps as string[]).map((step, idx) => (
                      <li key={idx} className="text-base">{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Checks */}
      {recentChecks && recentChecks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Checks</h2>
          <div className="space-y-4">
            {recentChecks.slice(0, 5).map((check) => (
              <Card key={check.id} className="hover-elevate" data-testid={`card-check-${check.id}`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {check.eligible ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{check.schemeName}</h3>
                      <p className="text-sm text-muted-foreground">{check.schemeCategory}</p>
                    </div>
                  </div>
                  <Badge variant={check.eligible ? "default" : "secondary"} className="text-base px-4 py-2">
                    {check.eligible ? "Eligible" : "Not Eligible"}
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
