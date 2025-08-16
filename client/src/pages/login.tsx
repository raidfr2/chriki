import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

const inviteFormSchema = z.object({
  inviteCode: z.string().min(6, "Invite code must be at least 6 characters").max(20, "Invite code is too long"),
});

type InviteForm = z.infer<typeof inviteFormSchema>;

export default function Login() {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [, navigate] = useLocation();

  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (data: InviteForm) => {
    setIsVerifying(true);
    try {
      // Simulate invite code verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any code that's at least 6 characters
      if (data.inviteCode.length >= 6) {
        toast({
          title: "Marhaba! Welcome to Chriki",
          description: "Invite code verified. Redirecting to chat...",
        });
        // Redirect to chat page after short delay
        setTimeout(() => {
          navigate("/chat");
        }, 1500);
      } else {
        throw new Error("Invalid invite code");
      }
    } catch (error) {
      toast({
        title: "Malich khoya!",
        description: "Invalid invite code. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
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
              AUTHENTICATION.REQUIRED.v1.0
            </div>
            <h1 className="text-xl sm:text-2xl font-light leading-tight mb-4">
              Enter your <span className="font-bold">invite code</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chriki is currently in private beta.<br/>
              Please enter your invitation code to continue.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-background border-2 border-foreground p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-sm font-bold tracking-wide">
                        INVITE.CODE
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-2 border-foreground font-mono text-lg h-12 focus:bg-muted text-center tracking-widest"
                          placeholder="XXXXXX-XXXXXX"
                          data-testid="input-invite-code"
                          autoComplete="off"
                          style={{ letterSpacing: '0.2em' }}
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
                  disabled={isVerifying}
                  data-testid="button-verify-code"
                >
                  {isVerifying ? "VERIFYING..." : "VERIFY.CODE"}
                </Button>
              </form>
            </Form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center space-y-3">
                <p className="text-xs text-muted-foreground font-mono">
                  // NO.INVITE.CODE?
                </p>
                <p className="text-sm text-muted-foreground">
                  Request access through our contact form on the homepage.<br/>
                  We're gradually expanding access to the Algerian community.
                </p>
                <Link 
                  href="/#contact"
                  className="inline-block text-sm font-medium hover:text-muted-foreground transition-colors"
                  data-testid="link-request-access"
                >
                  Request Access →
                </Link>
              </div>
            </div>
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