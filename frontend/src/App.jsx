import { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { warmBackend } from "./api/client";
import { initAnalytics } from "./services/analytics";

const App = () => {
  useEffect(() => {
    initAnalytics();
    warmBackend().catch(() => {});
  }, []);

  return <AppRoutes />;
};

export default App;
