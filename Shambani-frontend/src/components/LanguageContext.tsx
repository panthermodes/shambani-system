import { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "../utils/translations";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("shambani-language");
    // Only use saved language if it's explicitly set, otherwise default to English
    if (savedLanguage === "en" || savedLanguage === "sw") {
      return savedLanguage;
    }
    // Default to English for first-time users
    return "en";
  });

  // Save language preference to localStorage whenever it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("shambani-language", lang);
  };

  const t = (key: string): string => {
    const translation =
      translations[language][key as keyof typeof translations.en];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
