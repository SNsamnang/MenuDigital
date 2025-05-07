import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { users } from "../data/anachak"; // Import Data

export const processUserRoles = (users) => {
  const roleCount = {};

  users.forEach((user) => {
    roleCount[user.role] = (roleCount[user.role] || 0) + 1;
  });

  return Object.keys(roleCount).map((role) => ({
    name: role,
    value: roleCount[role],
  }));
};

const data = processUserRoles(users);

// Define Colors for Each Role
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PieChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name,value }) =>
            `${value}`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
