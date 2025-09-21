import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminDocument } from "@shared/admin-types";
import { AdminStorage } from "@/lib/admin-storage";
import { ArrowLeft, MapPin, Clock, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<AdminDocument | null>(null);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    if (id) {
      AdminStorage.initialize();
      const doc = AdminStorage.getDocumentById(id);
      if (doc) {
        setDocument(doc);
        const categories = AdminStorage.getAllCategories();
        const cat = categories.find(c => c.id === doc.category);
        setCategory(cat);
      }
    }
  }, [id]);

  if (!document) {
    return (
      <div className="font-sans bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-mono text-2xl font-bold mb-4">Service Not Found</h1>
          <Link href="/wraqi">
            <Button className="font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-background border-b-2 border-foreground px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/wraqi">
              <Button variant="outline" size="sm" className="font-mono">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
            
            {category && (
              <Badge variant="outline" className="font-mono">
                {category.icon} {category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="font-mono text-3xl font-bold tracking-tight dot-matrix mb-2">
            {document.title}
          </h1>
          
          {document.titleArabic && (
            <div className="text-lg text-muted-foreground mb-1">
              🇩🇿 {document.titleArabic}
            </div>
          )}
          
          {document.titleFrench && (
            <div className="text-lg text-muted-foreground">
              🇫🇷 {document.titleFrench}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {document.fees && (
            <Card className="border-2 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <CardTitle className="font-mono text-sm">FEES</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-lg font-bold">{document.fees}</div>
              </CardContent>
            </Card>
          )}
          
          {document.duration && (
            <Card className="border-2 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <CardTitle className="font-mono text-sm">DURATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-lg font-bold">{document.duration}</div>
              </CardContent>
            </Card>
          )}
          
          {document.location && (
            <Card className="border-2 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <CardTitle className="font-mono text-sm">LOCATION</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm">{document.location}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requirements */}
          {document.requirements.length > 0 && (
            <Card className="border-2 border-border">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle className="font-mono">REQUIREMENTS</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {document.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Required Documents */}
          {document.documents.length > 0 && (
            <Card className="border-2 border-border">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <CardTitle className="font-mono">REQUIRED DOCUMENTS</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {document.documents.map((doc, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm leading-relaxed">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Steps */}
        {document.steps.length > 0 && (
          <Card className="border-2 border-border mt-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <CardTitle className="font-mono">PROCESS STEPS</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {document.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed">{step}</div>
                      {index < document.steps.length - 1 && (
                        <div className="w-px h-4 bg-orange-200 dark:bg-orange-800 ml-4 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {document.notes && (
          <Card className="border-2 border-border mt-8">
            <CardHeader>
              <CardTitle className="font-mono">ADDITIONAL NOTES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed text-muted-foreground">
                {document.notes}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords */}
        {document.keywords.length > 0 && (
          <Card className="border-2 border-border mt-8">
            <CardHeader>
              <CardTitle className="font-mono text-sm">SEARCH KEYWORDS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {document.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="font-mono text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
