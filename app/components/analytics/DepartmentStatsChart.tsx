import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DepartmentReport } from "@/api/models";
import { Info } from "lucide-react";

interface DepartmentStatsChartProps {
  departmentStats: DepartmentReport[];
}

export const DepartmentStatsChart = ({
  departmentStats,
}: DepartmentStatsChartProps) => {
  const data = departmentStats.map((stat) => ({
    name: stat.department_name,
    "Total Ideas": stat.total_ideas,
    "Total Comments": stat.total_comments,
    "Total Users": stat.total_user,
    Contributors: stat.contributors,
    "Total Activity": stat.total_activity,
    "Ideas %": Math.round(stat.ideas_percentage),
  }));

  const sortedData = [...data].sort(
    (a, b) => b["Total Activity"] - a["Total Activity"],
  );

  const colors = {
    "Total Ideas": "#8884d8",
    "Total Comments": "#82ca9d",
    "Total Users": "#ffc658",
    Contributors: "#ff8042",
    "Total Activity": "#0088FE",
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Department Statistics</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sortedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `Department: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Total Ideas"
                stackId="1"
                stroke={colors["Total Ideas"]}
                fill={colors["Total Ideas"]}
              />
              <Area
                type="monotone"
                dataKey="Total Comments"
                stackId="1"
                stroke={colors["Total Comments"]}
                fill={colors["Total Comments"]}
              />
              <Area
                type="monotone"
                dataKey="Total Users"
                stackId="1"
                stroke={colors["Total Users"]}
                fill={colors["Total Users"]}
              />
              <Area
                type="monotone"
                dataKey="Contributors"
                stackId="1"
                stroke={colors["Contributors"]}
                fill={colors["Contributors"]}
              />
              <Area
                type="monotone"
                dataKey="Total Activity"
                stackId="1"
                stroke={colors["Total Activity"]}
                fill={colors["Total Activity"]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-info/20 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-2 text-sm">
            <Info className="w-12 h-12 text-info" />
            <p className="text-info">
              Departments are sorted by total activity. The chart shows
              cumulative statistics including total ideas, comments, users,
              contributors, and overall activity. Hover over the chart to see
              detailed statistics for each department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
