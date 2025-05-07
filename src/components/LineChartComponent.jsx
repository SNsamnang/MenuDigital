import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { anachakShop } from "../data/anachak"; 

export const processData = (data) => {
  const monthCount = {};

  data.forEach((shop) => {
    const month = new Date(shop.created_at).toLocaleString("default", {
      month: "long",
    }); // Example: "February 2025"
    monthCount[month] = (monthCount[month] || 0) + 1;
  });

  return Object.keys(monthCount).map((month) => ({
    month,
    count: monthCount[month],
  }));
};

const data = processData(anachakShop);

const LineChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;