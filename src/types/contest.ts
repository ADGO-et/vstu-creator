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
  contests:   ContestType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ContestType {
  _id:          string;
  quiz:         Quiz;
  enrollCount:  number;
  participants: string[];
  startTime:    Date;
  endTime:      Date;
  title:        string;
  description:  string;
  createdAt:    Date;
  updatedAt:    Date;
  isLive:       number;
  __v:          number;
}

export interface Quiz {
  _id:               string;
  questions:         Question[];
  topic:             Topic;
  quizTitle:         string;
  description:       string;
  language:          string;
  takenCount:        number;
  for:               string;
  isCreatorVerified: boolean;
  isAdminVerified:   boolean;
  __v:               number;
}

export interface Question {
  _id:              string;
  question:         string;
  choices:          string[];
  questionReported: number;
  issues:           Issue[];
  __v:              number;
}

export interface Issue {
  student: string;
  issue:   string;
}

export interface Topic {
  _id:          string;
  grade:        string;
  subject:      Subject;
  chapter:      number;
  chapterTitle: string;
  __v:          number;
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
}



export interface ContestParticipants {
  participants: Participant[];
  totalCount:   number;
  totalPages:   number;
  currentPage:  number;
}

export interface Participant {
  _id:            string;
  email:          string;
  firstName:      string;
  lastName:       string;
  address:        Address;
  school:         School;
  profilePicture: string;
}

export interface Address {
  region: string;
  zone:   string;
  woreda: string;
}

export interface School {
  _id:    string;
  name:   string;
  region: string;
  zone:   string;
  woreda: string;
  __v:    number;
}


export interface ContestSubmitPayload {
  selectedAnswers: { questionId: string; answer: string }[];
}

export interface ContestSubmitResponse {
  score: number;
  couponsReceived?: number;
}
