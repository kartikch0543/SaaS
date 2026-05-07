export const StatCard = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-glass backdrop-blur">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    <p className="mt-2 text-sm text-slate-600">{hint}</p>
  </div>
);
