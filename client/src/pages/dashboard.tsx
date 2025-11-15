import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Mic,
  History,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  MapPin,
  PenTool,
} from "lucide-react";
import type { User } from "@shared/schema";
import heroImage from "@assets/generated_images/Rural_farmer_using_smartphone_9c774d5b.png";

const modules = [
  {
    title: "Voice Assistant",
    description: "Ask questions using your voice",
    icon: Mic,
    url: "/assistant/voice",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Recent Queries",
    description: "View your conversation history",
    icon: History,
    url: "/queries",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Eligibility Checker",
    description: "Check government scheme eligibility",
    icon: CheckCircle,
    url: "/eligibility",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Market Data",
    description: "Live mandi prices and trends",
    icon: TrendingUp,
    url: "/markets",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    title: "Chat Assistant",
    description: "Chat with AI in text or voice",
    icon: MessageSquare,
    url: "/assistant/chat",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    title: "Document Analyzer",
    description: "Extract text and get summaries",
    icon: FileText,
    url: "/documents/analyze",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    title: "Service Discovery",
    description: "Find nearby government offices",
    icon: MapPin,
    url: "/services/search",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    title: "Draft Generator",
    description: "Create applications and letters",
    icon: PenTool,
    url: "/drafts",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
];

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Rural India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-dashboard-greeting">
            Welcome, {user?.fullName || user?.username || "User"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Access government services, schemes, and information with voice-powered AI assistance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3">Quick Access</h2>
          <p className="text-lg text-muted-foreground">
            Choose a service below to get started. Tap the microphone on any page to use voice commands.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link key={module.title} href={module.url}>
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full transition-all" data-testid={`card-module-${module.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardHeader className="space-y-4">
                  <div className={`w-24 h-24 rounded-lg ${module.bgColor} flex items-center justify-center mx-auto`}>
                    <module.icon className={`h-12 w-12 ${module.color}`} />
                  </div>
                  <CardTitle className="text-xl text-center">{module.title}</CardTitle>
                  <CardDescription className="text-center text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button variant="default" className="w-full" size="lg" data-testid={`button-open-${module.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Voice Shortcuts Info */}
        <Card className="mt-12 bg-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Mic className="h-8 w-8 text-primary" />
              Voice Shortcuts
            </CardTitle>
            <CardDescription className="text-lg">
              Use these voice commands anywhere in the app:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="font-semibold min-w-[200px]">"Check eligibility"</span>
                <span className="text-muted-foreground">→ Open Eligibility Checker</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold min-w-[200px]">"Show market prices"</span>
                <span className="text-muted-foreground">→ View Market Data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold min-w-[200px]">"Find services near me"</span>
                <span className="text-muted-foreground">→ Search Nearby Services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-semibold min-w-[200px]">"Create a letter"</span>
                <span className="text-muted-foreground">→ Generate Draft</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
