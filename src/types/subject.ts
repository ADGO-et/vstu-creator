import { Language } from "./language";

export interface Subject {
  _id: string;
  name: string;
  language: Language;
}
