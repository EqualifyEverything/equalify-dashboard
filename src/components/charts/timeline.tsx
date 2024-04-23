import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TimelineDataItem {
  date: string;
  equalified: number;
  active: number;
  ignored: number;
}

interface TimelineProps {
  data: TimelineDataItem[];
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} width={300} height={100}
        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
        className='text-sm'
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickMargin={8} />
        <YAxis/>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="equalified"
          stroke="#186121"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Equalified"
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Active"
        />
        <Line
          type="monotone"
          dataKey="ignored"
          stroke="#ffc658"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Ignored"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Timeline;
