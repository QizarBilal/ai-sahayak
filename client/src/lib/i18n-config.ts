import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files from src directory
import enCommon from '../locales/en/common.json';
import hiCommon from '../locales/hi/common.json';
import taCommon from '../locales/ta/common.json';
import teCommon from '../locales/te/common.json';
import bnCommon from '../locales/bn/common.json';
import mrCommon from '../locales/mr/common.json';
import guCommon from '../locales/gu/common.json';
import knCommon from '../locales/kn/common.json';
import mlCommon from '../locales/ml/common.json';
import paCommon from '../locales/pa/common.json';

const resources = {
  en: {
    common: enCommon
  },
  hi: {
    common: hiCommon
  },
  ta: {
    common: taCommon
  },
  te: {
    common: teCommon
  },
  bn: {
    common: bnCommon
  },
  mr: {
    common: mrCommon
  },
  gu: {
    common: guCommon
  },
  kn: {
    common: knCommon
  },
  ml: {
    common: mlCommon
  },
  pa: {
    common: paCommon
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'en',
    lng: localStorage.getItem('preferredLanguage') || 'en',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage'
    },

    interpolation: {
      escapeValue: false // React already escapes
    },

    react: {
      useSuspense: false
    }
  });

// Save language changes to localStorage and notify backend
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLanguage', lng);
  document.documentElement.setAttribute('lang', lng);
  
  // Send language preference to backend
  fetch('/api/user/language', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language: lng }),
  }).catch(err => console.error('Failed to save language preference:', err));
});

export default i18n;

// Helper function to get current language
export const getCurrentLanguage = () => i18n.language || 'en';

// Helper function to change language
export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  return lng;
};

// List of supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];
