export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-ink text-white hover:bg-slate",
    secondary: "bg-white/70 text-ink ring-1 ring-slate/10 hover:bg-white",
    ghost: "text-ink hover:bg-white/60"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
