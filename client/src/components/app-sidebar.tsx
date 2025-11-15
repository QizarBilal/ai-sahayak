import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  Mic,
  History,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  MapPin,
  PenTool,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const mainModules = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Voice Assistant",
    url: "/assistant/voice",
    icon: Mic,
  },
  {
    title: "Recent Queries",
    url: "/queries",
    icon: History,
  },
  {
    title: "Eligibility Checker",
    url: "/eligibility",
    icon: CheckCircle,
  },
  {
    title: "Market Data",
    url: "/markets",
    icon: TrendingUp,
  },
  {
    title: "Chat Assistant",
    url: "/assistant/chat",
    icon: MessageSquare,
  },
  {
    title: "Document Analyzer",
    url: "/documents/analyze",
    icon: FileText,
  },
  {
    title: "Service Discovery",
    url: "/services/search",
    icon: MapPin,
  },
  {
    title: "Draft Generator",
    url: "/drafts",
    icon: PenTool,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">AI-Sahayak</h1>
        <p className="text-sm text-muted-foreground">Government Services Assistant</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base px-6">Main Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
