export interface School {
  _id: string;
  name: string;
  region: string;
  zone: string;
  woreda: string;
}
export interface SchoolApiResponse {
  schools: School[];
  totalCount: number;
}
