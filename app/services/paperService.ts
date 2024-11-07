import { Paper, PapersResponse, PaperService } from '../models/Paper';

class ApiPaperService implements PaperService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPapers(page: number, per_page: number): Promise<PapersResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/papers?page=${page}&per_page=${per_page}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
  }

  async getPaperById(id: string | number): Promise<Paper> {
    try {
      const response = await fetch(`${this.baseUrl}/papers/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching paper ${id}:`, error);
      throw error;
    }
  }

  async searchPapers(query: string): Promise<PapersResponse> {
    throw new Error('Method not implemented.');
  }

  async getLikedPapers(): Promise<Paper[]> {
    throw new Error('Method not implemented.');
  }

  async likePaper(id: string | number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async unlikePaper(id: string | number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

// Mock service for development
class MockPaperService implements PaperService {
  private mockPapers: Paper[] = [
    {
      id: 1,
      title: "Attention Is All You Need",
      authors: [{ id: '1', name: "Vaswani et al." }],
      abstract: "We propose a new network architecture based solely on attention mechanisms. Experiments show these models to be superior in quality while being more parallelizable and requiring significantly less time to train...",
      journal: "NeurIPS",
      year: 2017,
      keywords: ["Deep Learning", "Attention", "Transformers"],
      citations: { count: 52000, lastUpdated: new Date() },
      type: 'research',
      status: 'published'
    },
    {
      id: 2,
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: [{ id: '2', name: "Devlin et al." }],
      abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations by jointly conditioning on both left and right context in all layers.",
      journal: "NAACL",
      year: 2019,
      keywords: ["NLP", "Transformers", "Pre-training"],
      citations: { count: 48000, lastUpdated: new Date() },
      type: 'research',
      status: 'published'
    },
    {
      id: 3,
      title: "GPT-3: Language Models are Few-Shot Learners",
      authors: [{ id: '3', name: "Brown et al." }],
      abstract: "We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches. Specifically, we train GPT-3, an autoregressive language model with 175 billion parameters.",
      journal: "NeurIPS",
      year: 2020,
      keywords: ["Language Models", "Few-shot Learning", "AI"],
      citations: { count: 25000, lastUpdated: new Date() },
      type: 'research',
      status: 'published'
    }
  ];

  async getPapers(page: number, per_page: number): Promise<PapersResponse> {
    const start = (page - 1) * per_page;
    const end = start + per_page;
    const papers = this.mockPapers.slice(start, end);

    return {
      papers,
      total: this.mockPapers.length,
      page,
      per_page,
      has_more: end < this.mockPapers.length
    };
  }

  async getPaperById(id: string | number): Promise<Paper> {
    const paper = this.mockPapers.find(p => p.id === id);
    if (!paper) throw new Error(`Paper with id ${id} not found`);
    return paper;
  }

  async searchPapers(query: string): Promise<PapersResponse> {
    const papers = this.mockPapers.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.abstract.toLowerCase().includes(query.toLowerCase())
    );
    return {
      papers,
      total: papers.length,
      page: 1,
      per_page: papers.length,
      has_more: false
    };
  }

  async getLikedPapers(): Promise<Paper[]> {
    return [];
  }

  async likePaper(id: string | number): Promise<void> {
    console.log('Liked paper:', id);
  }

  async unlikePaper(id: string | number): Promise<void> {
    console.log('Unliked paper:', id);
  }
}

// Export a single instance based on environment
export const paperService =
  process.env.NODE_ENV === "development"
    ? new MockPaperService()
    : new ApiPaperService("http://export.arxiv.org/api/query?search_query=all");