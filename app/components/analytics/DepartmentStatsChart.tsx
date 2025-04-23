import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DepartmentReport } from "@/api/models";

interface DepartmentStatsChartProps {
  departmentStats: DepartmentReport[];
}

export const DepartmentStatsChart = ({
  departmentStats,
}: DepartmentStatsChartProps) => {
  const data = departmentStats.map((dept) => ({
    name: dept.department_name,
    ideas: dept.total_ideas,
    comments: dept.total_comments,
    users: dept.total_users,
  }));

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Department Statistics</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Line
                type="monotone"
                dataKey="ideas"
                stroke="#8884d8"
                name="Total Ideas"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#82ca9d"
                name="Total Comments"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ffc658"
                name="Total Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
