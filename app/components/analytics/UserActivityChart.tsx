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
import { ActiveUser } from "@/api/models";

interface UserActivityChartProps {
  activeUsers: ActiveUser[];
}

export const UserActivityChart = ({ activeUsers }: UserActivityChartProps) => {
  const data = activeUsers
    .sort((a, b) => b.total_activity - a.total_activity)
    .slice(0, 5)
    .map((user) => ({
      name: user.name,
      ideas: user.ideas_count,
      comments: user.comments_count,
      total: user.total_activity,
    }));

  return (
    <div className="card">
      <h2 className="card-title">Top Active Users</h2>
      <div className="card-body">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ideas" fill="#8884d8" name="Ideas" />
              <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
              <Bar dataKey="total" fill="#ffc658" name="Total Activity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
