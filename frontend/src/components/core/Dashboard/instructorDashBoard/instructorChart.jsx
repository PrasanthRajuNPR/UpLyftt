import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
];

export default function InstructorChart({ courses = [] }) {
  const [chartType, setChartType] = useState("students");

  const studentData = courses
    .filter((c) => c?.totalStudentsEnrolled > 0)
    .map((c) => ({
      name: c.courseName,
      value: c.totalStudentsEnrolled,
    }));

  const incomeData = courses
    .filter((c) => c?.totalAmountGenerated > 0)
    .map((c) => ({
      name: c.courseName,
      value: c.totalAmountGenerated,
    }));

  const chartData =
    chartType === "students" ? studentData : incomeData;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Visualize
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setChartType("students")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
              chartType === "students"
                ? "bg-cyan-500 text-white"
                : "text-cyan-400 hover:bg-gray-800"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => setChartType("income")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
              chartType === "income"
                ? "bg-cyan-500 text-white"
                : "text-cyan-400 hover:bg-gray-800"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* CHART */}
      {chartData.length > 0 ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  chartType === "income"
                    ? `₹ ${value}`
                    : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No data to visualize
        </div>
      )}
    </div>
  );
}
