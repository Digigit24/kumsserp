import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { HierarchicalContextProvider } from "./contexts/HierarchicalContext";
import { ChatProvider } from "./contexts/ChatContext";
import { DataPrefetcher } from "./components/common/DataPrefetcher";
import { ModuleDataPrefetcher } from "./components/common/ModuleDataPrefetcher";
import AppRoutes from "./routes/routes";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PermissionsProvider>
          <HierarchicalContextProvider>
            <ChatProvider>
              <DataPrefetcher />
              <ModuleDataPrefetcher />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </ChatProvider>
          </HierarchicalContextProvider>
        </PermissionsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
