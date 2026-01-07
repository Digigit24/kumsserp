import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { HierarchicalContextProvider } from "./contexts/HierarchicalContext";
import { ChatProvider } from "./contexts/ChatContext";
import { DataPrefetcher } from "./components/common/DataPrefetcher";
import { ModuleDataPrefetcher } from "./components/common/ModuleDataPrefetcher";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <PermissionsProvider>
          <HierarchicalContextProvider>
            <ChatProvider>
              <DataPrefetcher />
              <ModuleDataPrefetcher />
              <AppRoutes />
            </ChatProvider>
          </HierarchicalContextProvider>
        </PermissionsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
