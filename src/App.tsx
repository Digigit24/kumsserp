import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { HierarchicalContextProvider } from "./contexts/HierarchicalContext";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <PermissionsProvider>
          <HierarchicalContextProvider>
            <AppRoutes />
          </HierarchicalContextProvider>
        </PermissionsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
