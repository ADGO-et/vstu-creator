export interface Main {
    videos:      Video[];
    totalCount:  number;
    currentPage: number;
    totalPages:  number;
}

export interface Video {
    _id:       string;
    title:     string;
    grade:     Grade;
    subject:   Subject;
    link:      string;
    thumbnail: string;
    language:  Language;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface Grade {
    _id:   string;
    grade: number;
}

export interface Language {
    language: string;
}

export interface Subject {
    _id:      string;
    name:     string;
    language: string;
    __v:      number;
}


export interface videoPayload{
    title: string;
    grade: string;
    subject: string;
    link: string;
    thumbnail?: string;
    language: string;
}