import { Toaster } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export const ThemedToaster = () => {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "18px",
          border: `1px solid ${isDark ? "#30405f" : "#d6dfed"}`,
          background: isDark ? "#10213c" : "#ffffff",
          color: isDark ? "#ecf2ff" : "#0b1220",
          boxShadow: isDark ? "0 18px 40px rgba(2, 6, 23, 0.35)" : "0 18px 40px rgba(15, 23, 42, 0.1)"
        }
      }}
    />
  );
};
