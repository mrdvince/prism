// Define all possible paper types
export type PaperType = 'research' | 'review' | 'preprint';
export type PaperStatus = 'published' | 'in_review' | 'preprint';

export interface Author {
  id: string;
  name: string;
  affiliation?: string;
  orcid?: string;
}

export interface Citation {
  count: number;
  lastUpdated: Date;
  source?: string; // e.g., 'google_scholar', 'semantic_scholar'
}

export interface Figure {
  id: string;
  url: string;
  caption: string;
  type: 'graph' | 'diagram' | 'photo' | 'table';
}

export interface Paper {
  id: number | string;  // Support both numeric and string IDs (like arXiv IDs)
  title: string;
  authors: Author[];
  abstract: string;
  journal: string;
  year: number;
  keywords: string[];
  citations?: Citation;
  doi?: string;
  url?: string;
  pdf_url?: string;
  figures?: Figure[];
  type?: PaperType;
  status?: PaperStatus;
  metadata?: {
    published_date: Date;
    updated_date?: Date;
    arxiv_category?: string[];
    venue?: string;
    pages?: string;
    volume?: string;
    issue?: string;
  };
}

// API response types
export interface PapersResponse {
  papers: Paper[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// API service interface
export interface PaperService {
  getPapers(page: number, per_page: number): Promise<PapersResponse>;
  getPaperById(id: string | number): Promise<Paper>;
  searchPapers(query: string): Promise<PapersResponse>;
  getLikedPapers(): Promise<Paper[]>;
  likePaper(id: string | number): Promise<void>;
  unlikePaper(id: string | number): Promise<void>;
} 