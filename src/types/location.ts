export interface Region {
  name: string;
  zones: Zone[];
}

export interface Zone {
  name: string;
  woredas: Woreda[];
  region: Region;
}

export interface Woreda {
  name: string;
  zone: Zone;
  hasDuplicate: boolean;
}
