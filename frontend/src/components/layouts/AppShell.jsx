import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { Button } from "../common/Button";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { label: "Viva Prep", to: "/viva-prep" },
  { label: "Roadmaps", to: "/roadmap-generator" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Technical Viva Guide", to: "/how-to-prepare-for-technical-viva" }
];

export const AppShell = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-hero-mesh text-fg">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/80 backdrop-blur">
        <div className="section-shell flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-fg">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <GraduationCap size={20} />
            </span>
            StudyForge AI
          </Link>
          <nav className="hidden gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-accent ${isActive ? "text-accent" : "text-muted"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={toggleTheme} className="px-4 py-2.5" aria-label="Toggle color theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/70 bg-surface/80">
        <div className="section-shell grid gap-8 py-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-fg">StudyForge AI</p>
            <p className="mt-3 max-w-sm text-sm text-muted">
              A premium student learning workspace built around real search intent, measurable progress, and confident viva preparation.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft">Top guides</p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <Link to="/dbms-viva-questions-for-beginners" className="block hover:text-accent">
                DBMS viva questions for beginners
              </Link>
              <Link to="/sql-joins-explained-with-examples" className="block hover:text-accent">
                SQL joins explained with examples
              </Link>
              <Link to="/frontend-roadmap-for-beginners" className="block hover:text-accent">
                Frontend roadmap for beginners
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-soft">Product paths</p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <Link to="/viva-prep" className="block hover:text-accent">
                AI viva preparation
              </Link>
              <Link to="/roadmap-generator" className="block hover:text-accent">
                AI roadmap generator
              </Link>
              <Link to="/dashboard" className="block hover:text-accent">
                Learning dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
