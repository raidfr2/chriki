import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdminDocument, AdminDocumentCategory } from "@shared/admin-types";
import { AdminStorage } from "@/lib/admin-storage";
import { 
  Search, 
  ArrowRight
} from 'lucide-react';

export default function Wraqi() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [categories, setCategories] = useState<AdminDocumentCategory[]>([]);
  const [quickActionDocuments, setQuickActionDocuments] = useState<AdminDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | 'fr'>('en');

  // Initialize storage and load data
  useEffect(() => {
    AdminStorage.initialize();
    loadData();
  }, []);

  const loadData = () => {
    const allDocuments = AdminStorage.getAllDocuments();
    setDocuments(allDocuments);
    setCategories(AdminStorage.getAllCategories());
    
    // Select 4 random documents for quick actions
    const shuffled = [...allDocuments].sort(() => 0.5 - Math.random());
    setQuickActionDocuments(shuffled.slice(0, 4));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleArabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleFrench?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // Filter categories based on search - show categories that have matching documents or match the search themselves
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    
    // Check if category name matches search
    const categoryMatches = 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.nameArabic?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if category has any documents that match search
    const hasMatchingDocuments = filteredDocuments.some(doc => doc.category === category.id);
    
    return categoryMatches || hasMatchingDocuments;
  });

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      {/* Navigation Header */}
      <header className="bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Empty left side for consistency */}
        </div>
        
        {/* Center Navigation Items */}
        <div className="flex items-center space-x-6">
          <Link href="/chat">
            <div className="font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer hover:text-accent-foreground">
              Chriki
            </div>
          </Link>
          <Link href="/tariqi">
            <div className="font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer hover:text-accent-foreground">
              Tariqi
            </div>
          </Link>
          <Link href="/wraqi">
            <div className="flex items-center space-x-2 font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer text-accent-foreground">
              <span>Wraqi</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Translation button removed */}
        </div>
      </header>

      {/* Main Search Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-mono text-4xl font-bold tracking-tight dot-matrix mb-4">WRAQI</h1>
          <p className="text-lg text-muted-foreground mb-12">Administrative services and document requirements</p>
          
          {/* Big Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input
              placeholder="Search for administrative services, documents, or procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-6 py-6 text-lg border-2 border-foreground rounded-lg font-mono placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-mono text-xl font-bold mb-6">QUICK.ACTIONS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActionDocuments.map((doc) => {
              const category = categories.find(cat => cat.id === doc.category);
              const displayTitle = selectedLanguage === 'ar' && doc.titleArabic 
                ? doc.titleArabic 
                : selectedLanguage === 'fr' && doc.titleFrench 
                ? doc.titleFrench 
                : doc.title;
              
              return (
                <Link key={doc.id} href={`/wraqi/${doc.id}`}>
                  <div className="bg-muted border-2 border-border p-4 text-center hover:bg-foreground hover:text-background transition-all cursor-pointer group">
                    <div className="text-2xl mb-2">{category?.icon || '📄'}</div>
                    <div className="font-mono text-sm font-bold group-hover:text-background">
                      {displayTitle.toUpperCase()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-2xl font-bold">
              SERVICE.CATEGORIES
            </h2>
            <div className="font-mono text-sm text-muted-foreground">
              // {searchQuery ? filteredCategories.length : categories.length} CATEGORIES.AVAILABLE
            </div>
          </div>
          <p className="text-muted-foreground">
            Browse by category to find the administrative service you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.sort((a, b) => a.name.length - b.name.length).map(category => {
            const categoryDocuments = filteredDocuments.filter(doc => doc.category === category.id);
            
            return (
              <Link key={category.id} href={`/wraqi/categories/${category.id}`}>
                <Card className="border-2 border-border h-fit cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group hover:border-foreground">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{category.icon}</div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <CardTitle className="font-mono text-lg leading-tight mb-4 group-hover:text-foreground transition-colors">
                      {selectedLanguage === 'en' ? category.name : (category.nameArabic || category.name)}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-mono text-xs group-hover:bg-foreground group-hover:text-background transition-colors">
                        {categoryDocuments.length} service{categoryDocuments.length !== 1 ? 's' : ''}
                      </Badge>
                      <div className="text-xs font-mono text-muted-foreground group-hover:text-foreground">
                        EXPLORE →
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-mono text-xl font-bold mb-2">NO.RESULTS.FOUND</h3>
            <div className="text-muted-foreground mb-6">
              No services found matching "{searchQuery}"
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              // TRY.DIFFERENT.SEARCH.TERMS
            </div>
          </div>
        )}

        {categories.length === 0 && !searchQuery && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="font-mono text-xl font-bold mb-2">NO.SERVICES.LOADED</h3>
            <div className="text-muted-foreground mb-6">
              Administrative services are being prepared for you
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              // LOADING.ADMINISTRATIVE.DATABASE
            </div>
          </div>
        )}

        {/* Stats Section */}
        {categories.length > 0 && !searchQuery && (
          <section className="mt-16 py-12 bg-muted/20 rounded-lg">
            <div className="text-center">
              <h3 className="font-mono text-xl font-bold mb-8">WRAQI.STATISTICS</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-mono text-3xl font-bold text-foreground">{categories.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Categories</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-bold text-foreground">{documents.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Services</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-bold text-foreground">48</div>
                  <div className="text-sm text-muted-foreground mt-1">Wilayas</div>
                </div>
                <div>
                  <div className="font-mono text-3xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground mt-1">Languages</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
