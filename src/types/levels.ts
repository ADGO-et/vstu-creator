export interface Main {
    levels:      Level[];
    totalCount:  number;
    currentPage: number;
    totalPages:  number;
}

export interface Level {
    _id:      string;
    parent:   string;
    name:     string;
    imageUrl: string;
    rangeMin: number;
    rangeMax: number;
    __v:      number;
}


export interface LevelPayload {
    parent:   string;
    name:     string;
    imageUrl: string;
    rangeMin: number;
    rangeMax: number;
}




export interface hierarchyLevels {
    levels:      MainLevel[];
    totalCount:  number;
    currentPage: number;
    totalPages:  number;
}

export interface MainLevel {
    levels: LevelLevel[];
    parent: string;
}

export interface LevelLevel {
    name:     string;
    imageUrl: string;
    rangeMin: number;
    rangeMax: number;
}
