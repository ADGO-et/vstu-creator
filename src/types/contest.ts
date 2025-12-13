// export interface Main {
//   contests: SingleContestType[];
// }

// export interface Contest {
//   contests: SingleContestType[];
// }

// export interface SingleContestType {
//   _id: string;
//   quiz: Quiz;
//   enrollCount: number;
//   participants: string[];
//   startTime: string;
//   endTime: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface Quiz {
//   _id: string;
//   questions: Question[];
//   topic: string;
//   quizTitle: string;
//   description: string;
//   language: string;
//   takenCount: number;
//   __v: number;
// }

// export interface Question {
//   _id: string;
//   question: string;
//   choices: string[];
//   questionFlagged: number;
//   answerFlagged: number;
//   __v: number;
// }

export interface Main {
  contests: ContestType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// ...remove the earlier ContestType with Date fields...

// keep this single, unified version
export interface ContestType {
  _id: string;
  quiz: {
    _id: string;
    questions: Question[];
    topic: Topic;
    quizTitle: string;
    description: string;
    language: string;
    takenCount: number;
    for: string;
    isCreatorVerified: boolean;
    isAdminVerified: boolean;
    __v: number;
  };
  enrollCount: number;
  participants: string[];
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isLive?: number;
  isPrivate?: boolean;
  __v: number;
}

export interface Quiz {
  _id: string;
  questions: Question[];
  topic: Topic;
  quizTitle: string;
  description: string;
  language: string;
  takenCount: number;
  for: string;
  isCreatorVerified: boolean;
  isAdminVerified: boolean;
  __v: number;
}

export interface Question {
  _id: string;
  question: string;
  choices: string[];
  questionReported: number;
  issues: Issue[];
  __v: number;
}

export interface Issue {
  student: string;
  issue: string;
}

export interface Topic {
  _id: string;
  grade: string;
  subject: Subject;
  chapter: number;
  chapterTitle: string;
  __v: number;
}

export interface Subject {
  _id: string;
  name: string;
  language: string;
  __v: number;
}

export interface AddContest {
  title: string;
  description: string;
  quiz: string;
  startTime: string;
  endTime: string;
  isPrivate?: boolean;
  school?: string;
}

export interface ContestParticipants {
  participants: Participant[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface Participant {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: Address;
  school: School;
  profilePicture: string;
}

export interface Address {
  region: string;
  zone: string;
  woreda: string;
}

export interface School {
  _id: string;
  name: string;
  region: string;
  zone: string;
  woreda: string;
  __v: number;
}

export interface ContestSubmitPayload {
  selectedAnswers: { questionId: string; answer: string }[];
}

export interface ContestSubmitResponse {
  score: number;
  couponsReceived?: number;
}

export interface ContestWithQuiz {
  _id: string;
  title: string;
  description?: string;
  isPrivate: boolean;
  enrollCount: number;
  startTime: string;
  endTime: string;
  participants: any[];
  quiz: {
    _id: string;
    quizTitle: string;
    description?: string;
    difficulty?: string;
    createdBy?: string;
    questions?: Array<{
      _id: string;
      question: string;
      choices: string[];
      questionReported: number;
      issues: Array<{
        _id: string;
        issue: string;
        student?: string;
        resolved?: boolean;
      }>;
      __v?: number;
    }>;
    topic?: {
      _id: string;
      grade?: string;
      subject?: {
        _id: string;
        name?: string;
        stream?: string | null;
        language?: string;
        __v?: number;
      };
      chapter?: number;
      chapterTitle?: string;
      __v?: number;
    };
    takenCount?: number;
    for?: string;
    isCreatorVerified?: boolean;
    isAdminVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ContestsResponse {
  contests: ContestWithQuiz[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
