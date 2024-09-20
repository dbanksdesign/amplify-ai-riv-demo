import { LineChart, Line } from "recharts";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 410, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 420, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 440, pv: 2400, amt: 2400 },
  { name: "Page E", uv: 490, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 410, pv: 2400, amt: 2400 },
];

export const Chart = (props: any) => {
  console.log(props);
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
};
