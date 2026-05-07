export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent/30",
    secondary: "bg-elev text-fg ring-1 ring-border hover:bg-panel focus-visible:ring-accent/20",
    ghost: "text-fg hover:bg-surface/70 focus-visible:ring-accent/20"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
