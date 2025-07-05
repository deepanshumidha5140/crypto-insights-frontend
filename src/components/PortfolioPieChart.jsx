import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

// Generate pastel-like distinct HSL colors
const generateColors = (n) =>
  Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 55%)`);

const formatCoinLabel = (coinId) =>
  coinId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function PortfolioPieChart({ portfolio }) {
  if (!portfolio || typeof portfolio.total_portfolio_value !== "number") return null;

  const totalValue = portfolio.total_portfolio_value;

  const data = Object.entries(portfolio)
    .filter(([coin]) => coin !== "total_portfolio_value")
    .map(([coin, info]) => ({
      name: formatCoinLabel(coin),
      value: typeof info.value_usd === "number" ? info.value_usd : 0,
    }));

  const COLORS = generateColors(data.length);

  const percentageMap = data.reduce((acc, entry) => {
    const percent = ((entry.value / totalValue) * 100).toFixed(1);
    acc[entry.name] = percent;
    return acc;
  }, {});

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 mt-14 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full"
      role="region"
      aria-label="Portfolio pie chart showing coin distribution"
    >
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
        <PieIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        Portfolio Distribution
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="90%"
            innerRadius="55%"
            paddingAngle={2}
            label={false}
            labelLine={false}
            isAnimationActive={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(val, _, props) =>
              [`$${Number(val).toFixed(2)}`, props?.payload?.name || ""]
            }
            contentStyle={{
              backgroundColor: "#fff",
              borderColor: "#e5e7eb",
              color: "#111827",
              borderRadius: "0.5rem",
              fontSize: "14px",
            }}
            wrapperStyle={{ zIndex: 50 }}
          />

          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            iconType="circle"
            formatter={(name) => `${name} (${percentageMap[name] || "0.0"}%)`}
            wrapperStyle={{
              fontSize: "14px",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}