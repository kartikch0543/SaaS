export const StatCard = ({ label, value, hint }) => (
  <div className="surface-card p-5">
    <p className="text-sm text-soft">{label}</p>
    <p className="mt-3 text-3xl font-bold text-fg">{value}</p>
    <p className="mt-2 text-sm text-muted">{hint}</p>
  </div>
);
