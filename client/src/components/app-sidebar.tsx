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
import { useTranslation } from "react-i18next";

const mainModules = [
  {
    titleKey: "nav.dashboard",
    url: "/",
    icon: Home,
  },
  {
    titleKey: "nav.voice",
    url: "/assistant/voice",
    icon: Mic,
  },
  {
    titleKey: "nav.queries",
    url: "/queries",
    icon: History,
  },
  {
    titleKey: "nav.eligibility",
    url: "/eligibility",
    icon: CheckCircle,
  },
  {
    titleKey: "nav.markets",
    url: "/markets",
    icon: TrendingUp,
  },
  {
    titleKey: "nav.chat",
    url: "/assistant/chat",
    icon: MessageSquare,
  },
  {
    titleKey: "nav.documents",
    url: "/documents/analyze",
    icon: FileText,
  },
  {
    titleKey: "nav.services",
    url: "/services/search",
    icon: MapPin,
  },
  {
    titleKey: "nav.drafts",
    url: "/drafts",
    icon: PenTool,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">{t('app.name')}</h1>
        <p className="text-sm text-muted-foreground">{t('app.tagline')}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base px-6">{t('nav.modules')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainModules.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.titleKey.split('.').pop()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{t(item.titleKey)}</span>
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
