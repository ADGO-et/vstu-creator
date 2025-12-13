export interface SalesPayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    gender: string;
    age: number;
    address: {
        region: string;
        woreda: string;
        zone: string;
    };
    languagesSpoken: string[];
}


export interface SalesProfileInfo {
    _id: string;
    role: "sales";
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
    languagesSpoken: {
        _id: string;
        language: string;
        slug: string;
        __v?: number;
    }[];
    isVerified: boolean;
    sales_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}




export interface ReferredPerson {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface Referral {
    _id: string;
    teacherId: string;
    salespersonId: string;
    referralCode: string;
    referredParentId: string;
    referredStudentId: string;
    referredParent: ReferredPerson;
    referredStudent: ReferredPerson;
    createdAt: string;
    updatedAt: string;
}

export interface SalesReferralsResponse {
    referrals: Referral[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}