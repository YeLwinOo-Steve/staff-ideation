import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { HiddenIdea } from "@/api/models";

interface HiddenStatsChartProps {
  hiddenIdeas: HiddenIdea[];
}

export const HiddenStatsChart = ({ hiddenIdeas }: HiddenStatsChartProps) => {
  // Group ideas by department
  const departmentStats = hiddenIdeas.reduce((acc, idea) => {
    const dept = idea.department?.[0] || "No Department";
    if (!acc[dept]) {
      acc[dept] = { hidden: 0, total: 0 };
    }
    if (idea.hidden) {
      acc[dept].hidden += 1;
    }
    acc[dept].total += 1;
    return acc;
  }, {} as Record<string, { hidden: number; total: number }>);

  const data = Object.entries(departmentStats)
    .map(([name, stats]) => ({
      name,
      hidden: stats.hidden,
      total: stats.total,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Hidden Content by Department</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hidden" fill="#ff8042" name="Hidden Ideas" />
              <Bar dataKey="total" fill="#8884d8" name="Total Ideas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 