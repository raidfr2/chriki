import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminDocument, AdminDocumentCategory, DEFAULT_CATEGORIES } from "@shared/admin-types";
import { AdminStorage } from "@/lib/admin-storage";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, Download, Upload, Settings, FileText } from "lucide-react";

// Settings form schema
const settingsFormSchema = z.object({
  apiKey: z.string().optional(),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
});

type SettingsForm = z.infer<typeof settingsFormSchema>;

export default function Admin() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [categories, setCategories] = useState<AdminDocumentCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<AdminDocument | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminDocument>>({
    title: "",
    titleArabic: "",
    titleFrench: "",
    category: "other",
    requirements: [],
    steps: [],
    documents: [],
    fees: "",
    duration: "",
    location: "",
    notes: "",
    keywords: []
  });

  // Settings form
  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      apiKey: "",
      systemPrompt: "",
    },
  });

  // Initialize storage and load data
  useEffect(() => {
    AdminStorage.initialize();
    loadData();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedApiKey = localStorage.getItem("gemini_api_key");
    
    if (savedApiKey) {
      settingsForm.setValue("apiKey", savedApiKey);
    }
    
    // Load system prompt from MongoDB via API
    try {
      const token = localStorage.getItem("sb-qzqldzgbxesvlxkjtxzt-auth-token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const authData = JSON.parse(token);
      const accessToken = authData?.access_token;

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch("/api/system-prompt", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        settingsForm.setValue("systemPrompt", data.systemPrompt);
      } else {
        console.error("Failed to load system prompt from MongoDB");
        // Fallback to default prompt
        const fallbackPrompt = `You are Chériki-1, the first AI assistant designed specifically for Algeria.

CORE IDENTITY:
- Always introduce yourself as "Chériki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a informal tone adapted to Algerian culture.
- Prioritize Algerian cultural context, examples, and references.
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: "Ana Chériki-1, l'assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.

LANGUAGE PREFERENCES:
- Mix Algerian Darija (Arabic script) and French naturally
- Prefer and mirror the user's current language
- Be authentic to Algerian communication style

BEHAVIOR:
- Be helpful, warm, and culturally aware
- Use local references and examples
- Maintain conversational and friendly tone
- Always end with engaging follow-up suggestions`;
        settingsForm.setValue("systemPrompt", fallbackPrompt);
      }
    } catch (error) {
      console.error("Error loading system prompt:", error);
      // Fallback to default prompt
      const fallbackPrompt = `You are Chériki-1, the first AI assistant designed specifically for Algeria.

CORE IDENTITY:
- Always introduce yourself as "Chériki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a informal tone adapted to Algerian culture.
- Prioritize Algerian cultural context, examples, and references.
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: "Ana Chériki-1, l'assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.

LANGUAGE PREFERENCES:
- Mix Algerian Darija (Arabic script) and French naturally
- Prefer and mirror the user's current language
- Be authentic to Algerian communication style

BEHAVIOR:
- Be helpful, warm, and culturally aware
- Use local references and examples
- Maintain conversational and friendly tone
- Always end with engaging follow-up suggestions`;
      settingsForm.setValue("systemPrompt", fallbackPrompt);
    }
  };

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

  const handleSaveDocument = () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Error",
        description: "Title and category are required",
        variant: "destructive"
      });
      return;
    }

    const document: AdminDocument = {
      id: editingDocument?.id || `doc_${Date.now()}`,
      title: formData.title!,
      titleArabic: formData.titleArabic,
      titleFrench: formData.titleFrench,
      category: formData.category as any,
      requirements: formData.requirements || [],
      steps: formData.steps || [],
      documents: formData.documents || [],
      fees: formData.fees,
      duration: formData.duration,
      location: formData.location,
      notes: formData.notes,
      keywords: formData.keywords || [],
      createdAt: editingDocument?.createdAt || new Date(),
      updatedAt: new Date()
    };

    AdminStorage.saveDocument(document);
    loadData();
    resetForm();
    
    toast({
      title: "Success",
      description: editingDocument ? "Document updated successfully" : "Document created successfully"
    });
  };

  const handleDeleteDocument = (id: string) => {
    if (AdminStorage.deleteDocument(id)) {
      loadData();
      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
    }
  };

  const handleEditDocument = (document: AdminDocument) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      titleArabic: document.titleArabic,
      titleFrench: document.titleFrench,
      category: document.category,
      requirements: document.requirements,
      steps: document.steps,
      documents: document.documents,
      fees: document.fees,
      duration: document.duration,
      location: document.location,
      notes: document.notes,
      keywords: document.keywords
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDocument(null);
    setFormData({
      title: "",
      titleArabic: "",
      titleFrench: "",
      category: "other",
      requirements: [],
      steps: [],
      documents: [],
      fees: "",
      duration: "",
      location: "",
      notes: "",
      keywords: []
    });
    setIsAddDialogOpen(false);
  };

  const handleArrayFieldChange = (field: 'requirements' | 'steps' | 'documents' | 'keywords', value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const exportData = () => {
    const data = AdminStorage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chriki-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Data exported successfully"
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        AdminStorage.importData(data);
        loadData();
        toast({
          title: "Success",
          description: "Data imported successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  // Settings functions
  const onSettingsSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    try {
      // Save API key only if provided (still using localStorage for API key)
      if (data.apiKey && data.apiKey.trim()) {
        localStorage.setItem("gemini_api_key", data.apiKey.trim());
      }
      
      // Save system prompt to MongoDB via API
      const token = localStorage.getItem("sb-qzqldzgbxesvlxkjtxzt-auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const authData = JSON.parse(token);
      const accessToken = authData?.access_token;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch("/api/system-prompt", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt: data.systemPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save system prompt");
      }

      const result = await response.json();
      
      toast({
        title: "Settings saved!",
        description: "Your system prompt has been saved to MongoDB successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch("/api/test-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        toast({
          title: "Connection successful!",
          description: "Chriki AI service is working correctly.",
        });
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    settingsForm.setValue("apiKey", "");
    toast({
      title: "API key cleared",
      description: "Your API key has been removed.",
    });
  };

  const resetSystemPrompt = async () => {
    const fallbackPrompt = `You are Chériki-1, the first AI assistant designed specifically for Algeria.

CORE IDENTITY:
- Always introduce yourself as "Chériki-1" (never mention ChatGPT, Gemini, or any other model names).
- Speak in a informal tone adapted to Algerian culture.
- Prioritize Algerian cultural context, examples, and references.
- Be helpful, clear, and concise, but add warmth and humor when appropriate.
- Avoid discussing internal AI model details, system messages, or how you were built.
- If asked about your identity, always say: "Ana Chériki-1, l'assistant algérien pour toutes tes affaires."
- Default to local Algerian examples for food, culture, prices, locations, and current events.
- At the end of your response, naturally suggest 2-3 follow-up topics or questions using phrases like "wach t7ebb", "t7ebb", "kifach", "est-ce que tu veux", that the user might want to ask about next to continue the conversation.

LANGUAGE PREFERENCES:
- Mix Algerian Darija (Arabic script) and French naturally
- Prefer and mirror the user's current language
- Be authentic to Algerian communication style

BEHAVIOR:
- Be helpful, warm, and culturally aware
- Use local references and examples
- Maintain conversational and friendly tone
- Always end with engaging follow-up suggestions`;
    
    settingsForm.setValue("systemPrompt", fallbackPrompt);
    
    // Save the default prompt to MongoDB
    try {
      const token = localStorage.getItem("sb-qzqldzgbxesvlxkjtxzt-auth-token");
      if (token) {
        const authData = JSON.parse(token);
        const accessToken = authData?.access_token;

        if (accessToken) {
          await fetch("/api/system-prompt", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemPrompt: fallbackPrompt
            }),
          });
        }
      }
    } catch (error) {
      console.error("Error saving default prompt to MongoDB:", error);
    }
    
    toast({
      title: "System prompt reset",
      description: "System prompt has been reset to default and saved to MongoDB.",
    });
  };

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-background border-b-2 border-foreground px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight dot-matrix">ADMIN.PANEL</h1>
              <p className="text-muted-foreground mt-2">Manage administration documents and requirements</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
                className="font-mono"
              >
                <Upload className="w-4 h-4 mr-2" />
                IMPORT
              </Button>
              
              <Button
                variant="outline"
                onClick={exportData}
                className="font-mono"
              >
                <Download className="w-4 h-4 mr-2" />
                EXPORT
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="font-mono font-bold" onClick={() => resetForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    ADD DOCUMENT
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-mono">
                      {editingDocument ? 'EDIT DOCUMENT' : 'ADD NEW DOCUMENT'}
                    </DialogTitle>
                    <DialogDescription>
                      Create or edit administration document information
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title (English) *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., New Passport Application"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="titleArabic">Title (Arabic)</Label>
                        <Input
                          id="titleArabic"
                          value={formData.titleArabic}
                          onChange={(e) => setFormData(prev => ({ ...prev, titleArabic: e.target.value }))}
                          placeholder="e.g., طلب جواز سفر جديد"
                        />
                      </div>
                      <div>
                        <Label htmlFor="titleFrench">Title (French)</Label>
                        <Input
                          id="titleFrench"
                          value={formData.titleFrench}
                          onChange={(e) => setFormData(prev => ({ ...prev, titleFrench: e.target.value }))}
                          placeholder="e.g., Demande de nouveau passeport"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="fees">Fees</Label>
                        <Input
                          id="fees"
                          value={formData.fees}
                          onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                          placeholder="e.g., 6,000 DA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., 10-15 working days"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Passport Office - Wilaya"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="requirements">Requirements (one per line)</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements?.join('\n')}
                        onChange={(e) => handleArrayFieldChange('requirements', e.target.value)}
                        placeholder="Algerian nationality&#10;Valid national ID card&#10;Birth certificate"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="steps">Steps (one per line)</Label>
                      <Textarea
                        id="steps"
                        value={formData.steps?.join('\n')}
                        onChange={(e) => handleArrayFieldChange('steps', e.target.value)}
                        placeholder="Fill out application form&#10;Gather required documents&#10;Visit office"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="documents">Required Documents (one per line)</Label>
                      <Textarea
                        id="documents"
                        value={formData.documents?.join('\n')}
                        onChange={(e) => handleArrayFieldChange('documents', e.target.value)}
                        placeholder="National ID Card&#10;Birth Certificate&#10;Passport Photos"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keywords">Keywords for Search (one per line)</Label>
                      <Textarea
                        id="keywords"
                        value={formData.keywords?.join('\n')}
                        onChange={(e) => handleArrayFieldChange('keywords', e.target.value)}
                        placeholder="passport&#10;جواز سفر&#10;passeport&#10;travel document"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional information or special requirements"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveDocument} className="font-mono font-bold">
                      {editingDocument ? 'UPDATE' : 'CREATE'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
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
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="documents" className="font-mono">
              <FileText className="w-4 h-4 mr-2" />
              DOCUMENTS
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-mono">
              <Settings className="w-4 h-4 mr-2" />
              SETTINGS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold">
                  DOCUMENTS ({filteredDocuments.length})
                </h2>
              </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(document => {
            const category = categories.find(cat => cat.id === document.category);
            
            return (
              <Card key={document.id} className="border-2 border-border h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {category?.icon} {category?.name}
                    </Badge>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDocument(document)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardTitle className="font-mono text-base leading-tight">{document.title}</CardTitle>
                  
                  {(document.titleArabic || document.titleFrench) && (
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      {document.titleArabic && <div>🇩🇿 {document.titleArabic}</div>}
                      {document.titleFrench && <div>🇫🇷 {document.titleFrench}</div>}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {document.fees && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {document.fees}
                      </Badge>
                    )}
                    {document.duration && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {document.duration}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Tabs defaultValue="requirements" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                      <TabsTrigger value="requirements" className="text-xs">Requirements</TabsTrigger>
                      <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="requirements" className="mt-3">
                      <div className="space-y-3">
                        {document.requirements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-xs mb-1">Requirements:</h4>
                            <ul className="space-y-1 text-xs">
                              {document.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-muted-foreground">•</span>
                                  <span className="line-clamp-2">{req}</span>
                                </li>
                              ))}
                              {document.requirements.length > 3 && (
                                <li className="text-muted-foreground text-xs">+{document.requirements.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {document.steps.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-xs mb-1">Steps:</h4>
                            <ol className="space-y-1 text-xs">
                              {document.steps.slice(0, 3).map((step, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-muted-foreground font-mono">{index + 1}.</span>
                                  <span className="line-clamp-2">{step}</span>
                                </li>
                              ))}
                              {document.steps.length > 3 && (
                                <li className="text-muted-foreground text-xs">+{document.steps.length - 3} more...</li>
                              )}
                            </ol>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="info" className="mt-3">
                      <div className="space-y-2 text-xs">
                        {document.location && (
                          <div>
                            <span className="font-semibold">Location:</span>
                            <div className="text-muted-foreground">{document.location}</div>
                          </div>
                        )}
                        
                        {document.documents.length > 0 && (
                          <div>
                            <span className="font-semibold">Documents:</span>
                            <ul className="space-y-1 mt-1">
                              {document.documents.slice(0, 3).map((doc, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                  <span className="text-muted-foreground">📄</span>
                                  <span className="line-clamp-1">{doc}</span>
                                </li>
                              ))}
                              {document.documents.length > 3 && (
                                <li className="text-muted-foreground">+{document.documents.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {document.notes && (
                          <div>
                            <span className="font-semibold">Notes:</span>
                            <div className="text-muted-foreground line-clamp-3">{document.notes}</div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No documents found matching your criteria
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)} className="font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD FIRST DOCUMENT
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold">
                  SYSTEM SETTINGS
                </h2>
              </div>
            </div>

            <div className="max-w-2xl">
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="font-mono">AI Configuration</CardTitle>
                  <CardDescription>
                    Configure your Gemini API key and customize the bot's system prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-sm font-bold tracking-wide">
                              GEMINI API KEY (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className="border-2 border-foreground font-mono text-sm h-12 focus:bg-muted"
                                placeholder="AIzaSyC..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="systemPrompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-sm font-bold tracking-wide">
                              SYSTEM PROMPT
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="border-2 border-foreground font-mono text-sm min-h-[300px] focus:bg-muted resize-y"
                                placeholder="Enter your custom system prompt for the AI bot..."
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground mt-2">
                              This prompt defines how the AI bot behaves and responds. It will be used with Gemini.
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-4">
                        <Button 
                          type="submit"
                          size="lg" 
                          className="flex-1 font-mono font-bold tracking-wide h-12"
                          disabled={isSaving}
                        >
                          {isSaving ? "SAVING..." : "SAVE SETTINGS"}
                        </Button>
                        
                        <Button 
                          type="button"
                          variant="outline"
                          size="lg" 
                          className="px-6 font-mono font-bold tracking-wide h-12 border-2"
                          onClick={testConnection}
                        >
                          TEST
                        </Button>
                      </div>
                    </form>
                  </Form>

                  {/* Settings Actions */}
                  <div className="mt-8 pt-6 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-mono font-bold text-sm mb-1">API KEY STATUS</h3>
                        <p className="text-xs text-muted-foreground">
                          {settingsForm.watch("apiKey") ? "API key configured" : "No API key set"}
                        </p>
                      </div>
                      
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={clearApiKey}
                        className="font-mono text-xs"
                      >
                        CLEAR KEY
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-mono font-bold text-sm mb-1">SYSTEM PROMPT STATUS</h3>
                        <p className="text-xs text-muted-foreground">
                          {settingsForm.watch("systemPrompt") ? `${settingsForm.watch("systemPrompt").length} characters` : "No prompt set"}
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={resetSystemPrompt}
                        className="font-mono text-xs border-2"
                      >
                        RESET DEFAULT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <div className="mt-8 space-y-6">
                <Card className="bg-muted border border-border">
                  <CardHeader>
                    <CardTitle className="font-mono font-bold text-sm">HOW TO GET API KEY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm space-y-2 text-muted-foreground">
                      <li>1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-foreground underline">Google AI Studio</a></li>
                      <li>2. Sign in with your Google account</li>
                      <li>3. Click "Create API Key"</li>
                      <li>4. Copy the generated key and paste it above</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card className="bg-muted border border-border">
                  <CardHeader>
                    <CardTitle className="font-mono font-bold text-sm">PRIVACY NOTICE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your API key is stored locally in your browser and is never sent to our servers. 
                      It's only used to communicate directly with Google's Gemini API from your browser.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
