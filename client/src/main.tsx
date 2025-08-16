import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="chriki-ui-theme">
    <App />
  </ThemeProvider>
);
