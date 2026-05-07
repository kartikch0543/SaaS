import { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { initAnalytics } from "./services/analytics";

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <AppRoutes />;
};

export default App;
