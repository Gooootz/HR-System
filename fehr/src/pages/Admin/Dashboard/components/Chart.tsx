import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  //   Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import EmployeeTypeSelect from "./employeetype-select";

const data = [
  { name: "CASEIT", Total: 10 },
  { name: "CBMA", Total: 24 },
  { name: "CET", Total: 10 },
  { name: "SOC", Total: 20 },
  { name: "SMS", Total: 25 },
  { name: "F&D", Total: 15 },
  { name: "DRRSO", Total: 5 },
  { name: "VPAA", Total: 8 },
  { name: "F&D", Total: 12 },
  { name: "F&D", Total: 14 },
];

const colors = [
  // "#8884d8",
  "#4fb074",
  "#d7d764",
  // "#ff8042",
  // "#8dd1e1",
  //   "#a4de6c",
];

export default function ChartComponent() {
  return (
    <>
      <div className="flex  items-center justify-end px-4">
        <EmployeeTypeSelect />
      </div>
      <ResponsiveContainer className="" width="95%" height="75%">
        <BarChart data={data}>
          <XAxis className="text-xs" dataKey="name" />
          <YAxis className="text-xs" dataKey="Total" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              fontSize: "12px",
              opacity: "0.9",
            }}
          />
          {/* <Legend /> */}
          <Bar dataKey="Total">
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
