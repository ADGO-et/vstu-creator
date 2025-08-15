export interface TeacherPayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    age: number;
    address: {
        region: string;
        woreda: string;
        zone: string;
    }
    languagesSpoken: string[];
    subject: string[];
    grades: string[];
    teachingExperience: number;
    school: string;
    password: string;
}


export interface TeacherProfileInfo {
    _id: string;
    role: "teacher";
    email: string;
    age: number;
    phoneNumber: string;
    gender: string;
    firstName: string;
    lastName: string;
    address: {
        region: string;
        zone: string;
        woreda: string;
        _id: string;
    };
    teachingExperience: number;
    school: string;
    grade: string[];
    subject: {
        _id: string;
        name: string;
        language: string;
        stream: string | null;
        __v: number;
    }[];
    languagesSpoken: {
        _id: string;
        language: string;
        slug: string;
        __v?: number;
    }[];
    grades: {
        _id: string;
        grade: number;
        subjects: string[];
        __v: number;
    }[];
    isVerified: boolean;
    teacher_id: string;
    createdAt: string;
    updatedAt: string;
}




export interface ReferredStudent {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface ReferredParent {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
}


export interface Referral {
    _id: string;
    referralCode: string;
    referredParentId: string;
    referredStudentId: string;
    referredParent: ReferredParent;
    referredStudent: ReferredStudent;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherReferralsResponse {
    referrals: Referral[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}