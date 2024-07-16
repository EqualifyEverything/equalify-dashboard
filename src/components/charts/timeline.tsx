import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './chart';

interface TimelineDataItem {
  date: string;
  equalified: number;
  active: number;
}

interface TimelineProps {
  data: TimelineDataItem[];
}

const chartConfig: ChartConfig = {
  equalified: {
    label: 'Equalified',
    color: 'hsl(120, 61%, 34%)', // #186121
  },
  active: {
    label: 'Active',
    color: 'hsl(262, 56%, 72%)', // #8884d8
  },
};

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  return (
    <div>
      <ChartContainer config={chartConfig} className="max-h-80 w-full">
        <AreaChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
          className="text-sm"
          accessibilityLayer
        >
          <CartesianGrid />
          <XAxis dataKey="date" tickMargin={8} scale="point" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="equalifiedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(120, 61%, 34%)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(120, 61%, 34%)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(262, 56%, 72%)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(262, 56%, 72%)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="equalified"
            type="natural"
            fill="url(#equalifiedGradient)"
            fillOpacity={0.4}
            stroke="hsl(120, 61%, 34%)"
          />
          <Area
            dataKey="active"
            type="natural"
            fill="url(#activeGradient)"
            fillOpacity={0.4}
            stroke="hsl(262, 56%, 72%)"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ChartContainer>
      <div className="sr-only">
        <h2>Chart Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Equalified</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.equalified}</td>
                <td>{item.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timeline;
