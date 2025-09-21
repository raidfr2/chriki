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
  ArrowRight,
  Languages,
  Settings
} from 'lucide-react';

export default function Services() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [categories, setCategories] = useState<AdminDocumentCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');

  // Initialize storage and load data
  useEffect(() => {
    AdminStorage.initialize();
    loadData();
  }, []);

  const loadData = () => {
    setDocuments(AdminStorage.getAllDocuments());
    setCategories(AdminStorage.getAllCategories());
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleArabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleFrench?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
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
            <div className="flex items-center space-x-2 font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer hover:text-accent-foreground">
              <span>Wraqi</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'ar' : 'en')}
            className="font-mono text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1"
            title="Change Language"
          >
            <Languages className="w-4 h-4" />
            {selectedLanguage === 'en' ? 'عربي' : 'EN'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="font-mono text-xs transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Page Header */}
      <header className="bg-background border-b-2 border-foreground px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="font-mono text-3xl font-bold tracking-tight dot-matrix">WRAQI</h1>
            <p className="text-muted-foreground mt-2">Administrative services and document requirements</p>
          </div>
          
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl font-bold">
              CATEGORIES ({categories.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.sort((a, b) => a.name.length - b.name.length).map(category => {
            const categoryDocuments = filteredDocuments.filter(doc => doc.category === category.id);
            
            return (
              <Link key={category.id} href={`/wraqi/categories/${category.id}`}>
                <Card className="border-2 border-border h-fit cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{category.icon}</div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <CardTitle className="font-mono text-lg leading-tight mb-4 group-hover:text-primary transition-colors">
                      {selectedLanguage === 'en' ? category.name : (category.nameArabic || category.name)}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {categoryDocuments.length} service{categoryDocuments.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No services available
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
