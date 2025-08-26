import { AdminDocument, AdminDocumentCategory, DEFAULT_CATEGORIES, DEFAULT_DOCUMENTS } from "@shared/admin-types";

const STORAGE_KEYS = {
  DOCUMENTS: 'chriki-admin-documents',
  CATEGORIES: 'chriki-admin-categories'
};

export class AdminStorage {
  // Initialize with default data if not exists
  static initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEFAULT_DOCUMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
  }

  // Document operations
  static getAllDocuments(): AdminDocument[] {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!stored) return DEFAULT_DOCUMENTS;
    
    try {
      const documents = JSON.parse(stored);
      return documents.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt)
      }));
    } catch (error) {
      console.error('Error parsing stored documents:', error);
      return DEFAULT_DOCUMENTS;
    }
  }

  static getDocumentById(id: string): AdminDocument | null {
    const documents = this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  static getDocumentsByCategory(category: string): AdminDocument[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.category === category);
  }

  static saveDocument(document: AdminDocument): void {
    const documents = this.getAllDocuments();
    const existingIndex = documents.findIndex(doc => doc.id === document.id);
    
    if (existingIndex >= 0) {
      documents[existingIndex] = { ...document, updatedAt: new Date() };
    } else {
      documents.push({ ...document, createdAt: new Date(), updatedAt: new Date() });
    }
    
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }

  static deleteDocument(id: string): boolean {
    const documents = this.getAllDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== id);
    
    if (filteredDocuments.length !== documents.length) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filteredDocuments));
      return true;
    }
    return false;
  }

  // Search functionality
  static searchDocuments(query: string): AdminDocument[] {
    const documents = this.getAllDocuments();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return documents;
    
    return documents.filter(doc => {
      // Search in title
      if (doc.title.toLowerCase().includes(searchTerm)) return true;
      if (doc.titleArabic?.toLowerCase().includes(searchTerm)) return true;
      if (doc.titleFrench?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in keywords
      if (doc.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))) return true;
      
      // Search in requirements
      if (doc.requirements.some(req => req.toLowerCase().includes(searchTerm))) return true;
      
      // Search in documents
      if (doc.documents.some(docName => docName.toLowerCase().includes(searchTerm))) return true;
      
      return false;
    });
  }

  // Check if query is related to administration documents
  static isAdminQuery(query: string): boolean {
    const searchTerm = query.toLowerCase().trim();
    
    // Administrative action keywords
    const adminActionKeywords = [
      'how to get', 'how to obtain', 'how to apply', 'how to request',
      'كيف أحصل على', 'كيف أطلب', 'كيفية الحصول على', 'طريقة الحصول على',
      'comment obtenir', 'comment demander', 'comment faire', 'procédure pour',
      'apply for', 'request', 'obtain', 'get', 'need', 'require',
      'أحتاج', 'أريد', 'أطلب', 'محتاج',
      'j\'ai besoin', 'je veux', 'je demande',
      'procedure', 'process', 'steps', 'requirements',
      'إجراءات', 'خطوات', 'شروط', 'متطلبات',
      'procédure', 'étapes', 'conditions', 'exigences'
    ];
    
    // Document type keywords
    const documentKeywords = [
      'passport', 'id card', 'birth certificate', 'marriage certificate',
      'جواز سفر', 'بطاقة هوية', 'شهادة ميلاد', 'شهادة زواج',
      'passeport', 'carte d\'identité', 'acte de naissance', 'acte de mariage',
      'license', 'permit', 'visa', 'residence',
      'رخصة', 'تصريح', 'فيزا', 'إقامة',
      'licence', 'permis', 'visa', 'résidence',
      'document', 'certificate', 'card', 'paper',
      'وثيقة', 'شهادة', 'بطاقة', 'ورقة',
      'document', 'certificat', 'carte', 'papier'
    ];
    
    // Check if query contains admin action + document keywords
    const hasActionKeyword = adminActionKeywords.some(keyword => 
      searchTerm.includes(keyword.toLowerCase())
    );
    
    const hasDocumentKeyword = documentKeywords.some(keyword => 
      searchTerm.includes(keyword.toLowerCase())
    );
    
    // Also check if any existing document keywords match
    const documents = this.getAllDocuments();
    const hasExistingKeyword = documents.some(doc => 
      doc.keywords.some(keyword => searchTerm.includes(keyword.toLowerCase()))
    );
    
    return hasActionKeyword || hasDocumentKeyword || hasExistingKeyword;
  }

  // Enhanced search with better query understanding
  static findBestMatch(query: string): AdminDocument | null {
    const documents = this.getAllDocuments();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return null;
    
    // Extract key terms from natural language queries
    const extractedTerms = this.extractDocumentTerms(searchTerm);
    
    // Score documents based on relevance
    const scoredDocuments = documents.map(doc => {
      let score = 0;
      
      // Check against extracted terms
      extractedTerms.forEach(term => {
        // Exact title match gets highest score
        if (doc.title.toLowerCase() === term) score += 100;
        if (doc.titleArabic?.toLowerCase() === term) score += 100;
        if (doc.titleFrench?.toLowerCase() === term) score += 100;
        
        // Title contains term
        if (doc.title.toLowerCase().includes(term)) score += 60;
        if (doc.titleArabic?.toLowerCase().includes(term)) score += 60;
        if (doc.titleFrench?.toLowerCase().includes(term)) score += 60;
        
        // Keyword exact match
        doc.keywords.forEach(keyword => {
          if (keyword.toLowerCase() === term) score += 90;
          if (keyword.toLowerCase().includes(term)) score += 40;
        });
      });
      
      // Original query matching (fallback)
      if (doc.title.toLowerCase().includes(searchTerm)) score += 30;
      if (doc.titleArabic?.toLowerCase().includes(searchTerm)) score += 30;
      if (doc.titleFrench?.toLowerCase().includes(searchTerm)) score += 30;
      
      doc.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(searchTerm)) score += 25;
      });
      
      // Requirements and documents contain query
      doc.requirements.forEach(req => {
        if (req.toLowerCase().includes(searchTerm)) score += 15;
      });
      
      doc.documents.forEach(docName => {
        if (docName.toLowerCase().includes(searchTerm)) score += 10;
      });
      
      return { document: doc, score };
    });
    
    // Sort by score and return best match
    const bestMatch = scoredDocuments
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)[0];
    
    return bestMatch?.document || null;
  }

  // Extract document-related terms from natural language queries
  private static extractDocumentTerms(query: string): string[] {
    const terms: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Document mapping for common phrases
    const documentMappings = {
      'passport': ['passport', 'جواز سفر', 'passeport'],
      'id card': ['id card', 'identity card', 'بطاقة هوية', 'carte d\'identité'],
      'birth certificate': ['birth certificate', 'شهادة ميلاد', 'acte de naissance'],
      'marriage certificate': ['marriage certificate', 'شهادة زواج', 'acte de mariage'],
      'driving license': ['driving license', 'driver license', 'رخصة قيادة', 'permis de conduire'],
      'visa': ['visa', 'فيزا', 'visa'],
      'residence permit': ['residence permit', 'تصريح إقامة', 'permis de séjour']
    };
    
    // Check for document type mentions
    Object.entries(documentMappings).forEach(([key, variations]) => {
      variations.forEach(variation => {
        if (lowerQuery.includes(variation.toLowerCase())) {
          terms.push(key);
          terms.push(variation);
        }
      });
    });
    
    // Extract nouns that might be document types
    const words = lowerQuery.split(/\s+/);
    const potentialDocuments = words.filter(word => 
      word.length > 3 && 
      !['how', 'to', 'get', 'obtain', 'apply', 'for', 'the', 'and', 'or', 'with'].includes(word)
    );
    
    terms.push(...potentialDocuments);
    
    return Array.from(new Set(terms)); // Remove duplicates
  }

  // Category operations
  static getAllCategories(): AdminDocumentCategory[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) return DEFAULT_CATEGORIES;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored categories:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategory(category: AdminDocumentCategory): void {
    const categories = this.getAllCategories();
    const existingIndex = categories.findIndex(cat => cat.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // Export/Import functionality
  static exportData(): { documents: AdminDocument[], categories: AdminDocumentCategory[] } {
    return {
      documents: this.getAllDocuments(),
      categories: this.getAllCategories()
    };
  }

  static importData(data: { documents: AdminDocument[], categories: AdminDocumentCategory[] }): void {
    if (data.documents) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents));
    }
    if (data.categories) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    }
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    this.initialize(); // Reinitialize with defaults
  }
}
