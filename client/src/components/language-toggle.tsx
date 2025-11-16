import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { supportedLanguages, changeLanguage } from "@/lib/i18n-config";

export function LanguageToggle() {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language;

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('accessibility.changeLanguage')}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('settings.selectLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto w-56">
        <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-accent font-semibold" : ""}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="ml-2 text-muted-foreground">({lang.name})</span>
            {currentLanguage === lang.code && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
