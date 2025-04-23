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
import { UserLog } from "@/api/models";

interface UserLogChartProps {
  userLogs: UserLog[];
}

export const UserLogChart = ({ userLogs }: UserLogChartProps) => {
  // Group logs by type and date
  const logsByDate = userLogs.reduce((acc, log) => {
    const date = new Date(log.time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        system_setting: 0,
        idea: 0,
        category: 0,
        department: 0,
        user: 0,
      };
    }
    acc[date][log.type] += 1;
    return acc;
  }, {} as Record<string, any>);

  const data = Object.values(logsByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">User Activity Timeline</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="idea"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="Ideas"
              />
              <Area
                type="monotone"
                dataKey="category"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Categories"
              />
              <Area
                type="monotone"
                dataKey="department"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
                name="Departments"
              />
              <Area
                type="monotone"
                dataKey="user"
                stackId="1"
                stroke="#ff8042"
                fill="#ff8042"
                name="Users"
              />
              <Area
                type="monotone"
                dataKey="system_setting"
                stackId="1"
                stroke="#0088FE"
                fill="#0088FE"
                name="System Settings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 