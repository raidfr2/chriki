import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const settingsFormSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
});

type SettingsForm = z.infer<typeof settingsFormSchema>;

export default function Settings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      apiKey: "",
      systemPrompt: "",
    },
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini_api_key");
    const savedSystemPrompt = localStorage.getItem("system_prompt");
    
    if (savedApiKey) {
      form.setValue("apiKey", savedApiKey);
    }
    
    if (savedSystemPrompt) {
      form.setValue("systemPrompt", savedSystemPrompt);
    } else {
      // Use fallback default prompt directly since file serving isn't working properly
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
      form.setValue("systemPrompt", fallbackPrompt);
    }
  }, [form]);

  const onSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    try {
      // Save API key and system prompt to localStorage
      localStorage.setItem("gemini_api_key", data.apiKey);
      localStorage.setItem("system_prompt", data.systemPrompt);
      
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved!",
        description: "Your API key and system prompt have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      // Test the connection by making a simple request
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
    form.setValue("apiKey", "");
    toast({
      title: "API key cleared",
      description: "Your API key has been removed.",
    });
  };

  const resetSystemPrompt = () => {
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
    
    form.setValue("systemPrompt", fallbackPrompt);
    localStorage.removeItem("system_prompt");
    toast({
      title: "System prompt reset",
      description: "System prompt has been reset to default.",
    });
  };

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-mono font-bold text-xl tracking-tight">CHRIKI</div>
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/chat" 
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
                data-testid="nav-chat"
              >
                Chat
              </Link>
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
                data-testid="nav-home"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="font-mono text-4xl sm:text-5xl font-bold mb-4 tracking-tight dot-matrix">
              SETTINGS.CONFIG
            </div>
            <div className="font-mono text-sm text-muted-foreground mb-6 tracking-wide">
              API.CONFIGURATION.v1.0
            </div>
            <h1 className="text-xl sm:text-2xl font-light leading-tight mb-4">
              Configure your <span className="font-bold">AI Settings</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Configure your Gemini API key and customize the bot's system prompt.<br/>
              All settings are stored locally and never shared.
            </p>
          </div>

          {/* Settings Form */}
          <div className="bg-background border-2 border-foreground p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-sm font-bold tracking-wide">
                        GEMINI.API.KEY
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="border-2 border-foreground font-mono text-sm h-12 focus:bg-muted"
                          placeholder="AIzaSyC..."
                          data-testid="input-api-key"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-sm font-bold tracking-wide">
                        SYSTEM.PROMPT
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border-2 border-foreground font-mono text-sm min-h-[200px] focus:bg-muted resize-y"
                          placeholder="Enter your custom system prompt for the AI bot..."
                          data-testid="input-system-prompt"
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
                    data-testid="button-save-settings"
                  >
                    {isSaving ? "SAVING..." : "SAVE.SETTINGS"}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg" 
                    className="px-6 font-mono font-bold tracking-wide h-12 border-2"
                    onClick={testConnection}
                    data-testid="button-test-api"
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
                  <h3 className="font-mono font-bold text-sm mb-1">API.KEY.STATUS</h3>
                  <p className="text-xs text-muted-foreground">
                    {form.watch("apiKey") ? "API key configured" : "No API key set"}
                  </p>
                </div>
                
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={clearApiKey}
                  className="font-mono text-xs"
                  data-testid="button-clear-api"
                >
                  CLEAR.KEY
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">SYSTEM.PROMPT.STATUS</h3>
                  <p className="text-xs text-muted-foreground">
                    {form.watch("systemPrompt") ? `${form.watch("systemPrompt").length} characters` : "No prompt set"}
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={resetSystemPrompt}
                  className="font-mono text-xs border-2"
                  data-testid="button-reset-prompt"
                >
                  RESET.DEFAULT
                </Button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 space-y-6">
            <div className="bg-muted border border-border p-6">
              <h3 className="font-mono font-bold text-sm mb-3">HOW.TO.GET.API.KEY</h3>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li>1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-foreground underline">Google AI Studio</a></li>
                <li>2. Sign in with your Google account</li>
                <li>3. Click "Create API Key"</li>
                <li>4. Copy the generated key and paste it above</li>
              </ol>
            </div>

            <div className="bg-muted border border-border p-6">
              <h3 className="font-mono font-bold text-sm mb-3">PRIVACY.NOTICE</h3>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally in your browser and is never sent to our servers. 
                It's only used to communicate directly with Google's Gemini API from your browser.
              </p>
            </div>
          </div>

          {/* Technical Info */}
          <div className="mt-8 text-center">
            <div className="text-xs font-mono text-muted-foreground space-y-1">
              <div>// GEMINI.MODEL: gemini-2.5-flash</div>
              <div>// STORAGE: localStorage</div>
              <div>// SECURITY: client-side.only</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}