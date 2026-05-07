import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const StudyChart = ({ data }) => (
  <div className="h-80 rounded-3xl border border-white/60 bg-white/85 p-6 shadow-glass">
    <h3 className="font-display text-lg font-semibold text-ink">Weekly learning momentum</h3>
    <div className="mt-6 h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#ff7a59" strokeWidth={3} />
          <Line type="monotone" dataKey="score" stroke="#0f766e" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
