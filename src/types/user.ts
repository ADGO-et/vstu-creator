import { Grade } from "./grade";
import { Language } from "./language";
import { School } from "./school";

interface Address {
  region: string;
  woreda: string;
  zone: string;
}

interface Subscription {
  endDate: string;
  subscriptionType: string;
  subscriptionMethod: string;
}


export interface LoginCreator {
  email?: string;
  phoneNumber?: string;
  password: string;
}


export interface LoginTeacherAndSales {
  phoneNumber?: string;
  password: string;
}

export interface Parent {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  language: Language;
  children: string[];
  createdAt: string;
  updatedAt: string;
}


interface StudentLevel {
  _id: string;
  name: string;
  parent: string;
  imageUrl: string;
  rangeMax: number;
  rangeMin: number;
}

export interface Student {
  address: Address;
  subscription: Subscription;
  _id: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  profilePicture?: string | undefined;
  lastName: string;
  password: string;
  birthDate: string;
  totalScore: number;
  yearlyRank: number;
  weeklyRank: number;
  gender: string;
  language: Language;
  s_id: string;
  grade: Grade;
  coupons: number;
  school: School;
  createdAt: string;
  updatedAt: string;
  level: StudentLevel;
  count: number;
}
