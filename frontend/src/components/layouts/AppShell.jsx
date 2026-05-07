import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Viva Prep", to: "/viva-prep" },
  { label: "Roadmaps", to: "/roadmap-generator" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "SEO Library", to: "/seo-library" }
];

export const AppShell = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark bg-ink text-white" : "bg-hero-mesh text-ink"}>
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            StudyForge AI
          </Link>
          <nav className="hidden gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-ember" : "text-slate-700"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => setDarkMode((current) => !current)}
            className="rounded-full bg-white/70 p-3"
            aria-label="Toggle color theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
