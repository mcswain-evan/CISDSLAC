
export type ComplianceLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface ComplianceRating {
  theme: string;
  rating: 'N' | 'M' | 'S' | 'C' | 'P';
}

export interface GradeStatus {
  status: ComplianceLevel;
  reason: string;
}

export interface Book {
  title: string;
  author: string;
  pubDate: string;
  pageCount: string;
  themes: string[];
  goodreadsUrl: string;
  complianceStatus: ComplianceLevel; // Overall status
  complianceReason: string;
  detailedRatings: ComplianceRating[];
  gradeCompliance: {
    elementary: GradeStatus;
    intermediate: GradeStatus;
    highSchool: GradeStatus;
  };
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface BookResult {
  books: Book[];
  sources: GroundingSource[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
