import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import VoiceAssistant from "@/pages/voice-assistant";
import RecentQueries from "@/pages/recent-queries";
import EligibilityChecker from "@/pages/eligibility-checker";
import MarketData from "@/pages/market-data";
import ChatAssistant from "@/pages/chat-assistant";
import DocumentAnalyzer from "@/pages/document-analyzer";
import ServiceDiscovery from "@/pages/service-discovery";
import DraftGenerator from "@/pages/draft-generator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assistant/voice" component={VoiceAssistant} />
      <Route path="/queries" component={RecentQueries} />
      <Route path="/eligibility" component={EligibilityChecker} />
      <Route path="/markets" component={MarketData} />
      <Route path="/assistant/chat" component={ChatAssistant} />
      <Route path="/documents/analyze" component={DocumentAnalyzer} />
      <Route path="/services/search" component={ServiceDiscovery} />
      <Route path="/drafts" component={DraftGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b shrink-0">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
