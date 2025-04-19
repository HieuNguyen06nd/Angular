export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface SectionsState {
  information: boolean;
  details: boolean;
  custom: boolean;
  review: boolean;
}