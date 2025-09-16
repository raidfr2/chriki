import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { signUpSchema, signInSchema, type SignUpData, type SignInData } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate("/chat");
  }

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "", // Will be filled later in profile setup
      username: "",
    },
  });

  const onSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const { user, error } = await signIn(data);
      if (user && !error) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { user, error } = await signUp(data);
      if (!error) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then sign in to complete your profile.",
        });
        // Switch to sign in tab
        signUpForm.reset();
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
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
            
            <Link 
              href="/" 
              className="text-sm font-medium hover:text-muted-foreground transition-colors"
              data-testid="nav-back"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="font-mono text-4xl sm:text-5xl font-bold mb-4 tracking-tight dot-matrix">
              ACCESS.CHRIKI
            </div>
            <div className="font-mono text-sm text-muted-foreground mb-6 tracking-wide">
              AUTHENTICATION.SYSTEM.v2.0
            </div>
            <h1 className="text-xl sm:text-2xl font-light leading-tight mb-4">
              Welcome to <span className="font-bold">Chériki-1</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to your account or create a new one<br/>
              to start chatting with Algeria's AI assistant.
            </p>
          </div>

          {/* Auth Forms */}
          <div className="bg-background border-2 border-foreground p-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signin" className="font-mono">SIGN.IN</TabsTrigger>
                <TabsTrigger value="signup" className="font-mono">SIGN.UP</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-sm font-bold tracking-wide">
                            EMAIL.ADDRESS
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="border-2 border-foreground font-mono h-12 focus:bg-muted"
                              placeholder="user@example.com"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                <FormField
                      control={signInForm.control}
                      name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-sm font-bold tracking-wide">
                            PASSWORD
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                              type="password"
                              className="border-2 border-foreground font-mono h-12 focus:bg-muted"
                              placeholder="••••••••"
                              autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full font-mono font-bold tracking-wide h-12"
                      disabled={isLoading}
                >
                      {isLoading ? "SIGNING.IN..." : "SIGN.IN"}
                </Button>
              </form>
            </Form>
              </TabsContent>
              
                            <TabsContent value="signup">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-sm font-bold tracking-wide">
                            EMAIL.ADDRESS *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="border-2 border-foreground font-mono h-12 focus:bg-muted"
                              placeholder="ahmed@example.com"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-sm font-bold tracking-wide">
                            PASSWORD *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-2 border-foreground font-mono h-12 focus:bg-muted"
                              placeholder="••••••••"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      size="lg" 
                      className="w-full font-mono font-bold tracking-wide h-12"
                      disabled={isLoading}
                    >
                      {isLoading ? "CREATING.ACCOUNT..." : "CREATE.ACCOUNT"}
                    </Button>

                    <div className="text-center pt-4">
                      <p className="text-xs text-muted-foreground font-mono">
                        // PROFILE.SETUP.AFTER.REGISTRATION
                      </p>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Technical Info */}
          <div className="mt-8 text-center">
            <div className="text-xs font-mono text-muted-foreground space-y-1">
              <div>// SYSTEM.STATUS: OPERATIONAL</div>
              <div>// SECURITY.LEVEL: BETA.ACCESS</div>
              <div>// REGION: ALGERIA.DZ</div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative mt-8">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-foreground"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-foreground"></div>
          </div>
        </div>
      </section>
    </div>
  );
}