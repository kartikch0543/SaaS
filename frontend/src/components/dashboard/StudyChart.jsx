import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../../context/ThemeContext";

export const StudyChart = ({ data }) => {
  const { isDark } = useTheme();

  return (
    <div className="surface-card h-80 p-6">
      <h3 className="font-display text-lg font-semibold text-fg">Weekly learning momentum</h3>
      <div className="mt-6 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#21304f" : "#d6dfed"} />
            <XAxis dataKey="day" stroke={isDark ? "#a9b8d2" : "#6b7280"} />
            <YAxis stroke={isDark ? "#a9b8d2" : "#6b7280"} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: `1px solid ${isDark ? "#30405f" : "#d6dfed"}`,
                background: isDark ? "#10213c" : "#ffffff",
                color: isDark ? "#ecf2ff" : "#0b1220"
              }}
            />
            <Line type="monotone" dataKey="hours" stroke="#ff7a59" strokeWidth={3} />
            <Line type="monotone" dataKey="score" stroke="#198772" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
