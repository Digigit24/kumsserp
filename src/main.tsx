import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/settings/context/SettingsProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { queryClient } from "./lib/react-query";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
         <TooltipProvider delayDuration={200}>
      <App />
      </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
