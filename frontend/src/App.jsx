import { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { warmBackend } from "./api/client";

const App = () => {
  useEffect(() => {
    warmBackend().catch(() => {});
  }, []);

  return <AppRoutes />;
};

export default App;
