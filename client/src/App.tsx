import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth-context";
import { LocationProvider } from "./lib/location-context";
import { TutorialProvider } from "./lib/tutorial-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OnboardingRedirect } from "@/components/OnboardingRedirect";
import { useAccentColor } from "@/hooks/use-accent-color";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Chat from "@/pages/chat";
import Settings from "@/pages/settings";
import Services from "@/pages/services";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  useAccentColor(); // Apply accent colors globally
  
  return (
    <OnboardingRedirect>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/chat">
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        </Route>
        <Route path="/services" component={Services} />
        <Route path="/onboarding">
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </OnboardingRedirect>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TutorialProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </TutorialProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
