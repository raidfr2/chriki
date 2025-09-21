import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Link } from 'wouter';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Edit, Trash2, Plus, Languages } from 'lucide-react';
import { AdminStorage } from '@/lib/admin-storage';
import { AdminDocument, AdminDocumentCategory } from '../../../shared/admin-types';

export default function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [category, setCategory] = useState<AdminDocumentCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const loadData = async () => {
      try {
        AdminStorage.initialize();
        const allDocuments = AdminStorage.getAllDocuments();
        const allCategories = AdminStorage.getAllCategories();
        
        const categoryData = allCategories.find(cat => cat.id === categoryId);
        const categoryDocuments = allDocuments.filter(doc => doc.category === categoryId);
        
        setCategory(categoryData || null);
        setDocuments(categoryDocuments);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  const handleEditDocument = (document: AdminDocument) => {
    // TODO: Implement edit functionality
    console.log('Edit document:', document);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      AdminStorage.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg font-mono">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg font-mono mb-4">Category not found</div>
            <Link to="/wraqi">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/wraqi">
                <Button variant="ghost" size="sm" className="font-mono">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h1 className="font-mono text-2xl font-bold">
                    {selectedLanguage === 'en' ? category.name : (category.nameArabic || category.name)}
                  </h1>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'ar' : 'en')}
              className="font-mono"
            >
              <Languages className="w-4 h-4 mr-2" />
              {selectedLanguage === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl font-bold">
              SERVICES ({documents.length})
            </h2>
            <Button className="font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map(document => (
              <Link key={document.id} to={`/wraqi/${document.id}`}>
                <Card className="border-2 border-border h-fit cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditDocument(document);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteDocument(document.id);
                          }}
                          className="text-destructive hover:text-destructive h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <CardTitle className="font-mono text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
                      {selectedLanguage === 'en' ? document.title : (document.titleArabic || document.title)}
                    </CardTitle>
                    
                    <div className="flex items-center space-x-1">
                      {document.fees && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {document.fees}
                        </Badge>
                      )}
                      {document.duration && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {document.duration}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{category.icon}</div>
            <div className="text-lg font-mono mb-2">No services in this category yet</div>
            <div className="text-muted-foreground mb-6">
              This category is ready for services to be added
            </div>
            <Button className="font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Add First Service
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
