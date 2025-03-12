import { langs } from "@/constants/lang";
import { Language } from "@/types/language";

export const getLocalLabel = (lang: Language) => {
  const label = langs.find((l) => l.slug === lang.slug)?.name;
  return label || lang.language;
};
