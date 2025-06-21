import { Language } from "./language";

//New Model. Skip refactoring this
export interface QuizState {
  for: "QUIZ" | "CONTEST";
  id: string; // quiz ID
  contestId?: string; // Add this line
  questions: {
    _id: string;
    question: string;
    options: string[];
    correctI: number;
    answeredI: number | null;
    isReported: boolean;
  }[];
  index: number | null;
  intent: "start" | "answer" | "submit" | "result";
  retrievedScore?: number; // Mark as optional
  couponsReceived?: number;
}

//New Model. Skip refactoring this
export interface StudentAttempts {
  _id: string;
  studentId: string; //object id
  attempts: {
    _id: string;
    quizId: string;
    score: number;
    initialScore: number;
    for: "QUIZ" | "CONTEST";
    updatedAt: string;
    selectedAnswers: {
      questionId: string;
      answer: string;
      _id: string;
    }[];
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface SingleStudentAttempt {
  _id: string;
  quizId: string;
  score: number;
  initialScore: number;
  for: "QUIZ" | "CONTEST";
  updatedAt: string;
  selectedAnswers: {
    questionId: string;
    answer: string;
    _id: string;
  }[];
}

export interface SubmitAttempt {
  for: "QUIZ" | "CONTEST";
  quizId: string;

  selectedAnswers: {
    questionId: string;
    answer: string;
  }[];
  studentId: string;
  score: number;
}

export interface QuizzesAPIResponse {
  quizzes: Quiz[];
  totalCount: number;
}

export interface Question {
  problemWithQuestion: number;
  problemWithAnswer: number;
  problemWithAnswerReasons: any[];
  _id: string;
  question: string;
  choices: string[];
  questionFlagged: number;
  answerFlagged: number;
}

//New Model
// export interface Topic {
//   _id: string;
//   subject: string;
//   chapter: number;
//   chapterTitle: string;
// }

//New Model. Apply UI refactors only in admin pages
export interface Quiz {
  _id: string;
  questions: Question[];
  topic: {
    _id: string;
    grade: string; //grade id
    subject: Subject; // Change this line to use Subject type
    chapter: number;
    chapterTitle: string;
  };
  quizTitle: string;
  description: string;
  language: Language;
  takenCount: number;
  createdAt: string;
  isAdminVerified: boolean;
  for: "QUIZ" | "CONTEST";
}

export interface QuizType {
  _id: string;
  questions: Question[];
  topic: Topic;
  quizTitle: string;
  description: string;
  language: Language;
  takenCount: number;
  createdAt: string;
  isAdminVerified: boolean;
  for: "QUIZ" | "CONTEST";
}
export interface QuizResponse {
  quizzes: Quiz[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface Subject {
  _id: string;
  name: string;
  language: Language;
}
//New Model
export interface Topic {
  _id: string;
  grade: { grade: number; _id?: string };
  subject: Subject;
  chapter: number;
  chapterTitle: string;
}

export interface TopicsResponse {
  topics: Topic[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface TopicWithInfo {
  _id: string;
  grade: number;
  subject: string;
  chapter: number;
  chapterTitle: string;
  quizCount: number;
}

export interface AddEditTopic {
  grade: string;
  subject: string;
  chapter: number;
  chapterTitle: string;
}

export interface AddQuestion {
  question: string;
  choices: string[];
}

//New Model
export interface AddEditQuiz {
  questions: string[];
  topic: string;
  // language: string;
  quizTitle: string;
  description: string;
}

export interface AddEditQuizforContest {
  questions: string[];
  topic: string;
  // language: string;
  quizTitle: string;
  description: string;
  for: "CONTEST";
}

export interface TotalQuizzesContestCount {
  gradeCounts: GradeCount[];
  overallCounts: OverallCounts;
}

export interface GradeCount {
  grade: number;
  quizzesCount: number;
  contestsCount: number;
}

export interface OverallCounts {
  quizzes: number;
  contests: number;
}
