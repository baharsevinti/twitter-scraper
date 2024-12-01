import { Card } from 'antd';
import React from 'react';
import { useLocation } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAPI } from "../services/api";

interface Tweet {
  _id: string;
  Content: string;
  Photos: string[];
  TweetLink: string;
  Timestamp: string;
  Comments: string;
  Retweets: string;
  Likes: string;
  Analytics: string;
}

// Grafik için renk kodlarımız
const COLORS = ['#0263B8CC', '#A45CC0FF', '#13BE0DFF', '#FF8042', '#9933FF', '#FF3333'];

const Visualization: React.FC = () => {
  const [tweets, setTweets] = React.useState<Tweet[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const location = useLocation();
  const { username } = location.state;
  const { get } = useAPI();

  React.useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await get(`http://localhost:8000/tweets/${username}`);
        const data = response as { tweets: Tweet[]; Success: boolean };

        if (data.Success) {
          setTweets(data.tweets);
        } else {
          throw new Error("Tweetler alınırken bir hata oluştu.");
        }
      } catch (err: unknown) {
        console.error("Tweetler alınırken hata oluştu:", err);
        setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [get, username]);

  if (loading) {
    return <div className="text-center">Veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Veriler alınırken hata oluştu: {error}</div>;
  }

  // Tweet sayısı ve beğeni sayısı zaman çizelgesi için veriler
  const timelineData = tweets.map(tweet => ({
    date: new Date(tweet.Timestamp).toLocaleDateString(),
    tweets: 1,
    likes: parseInt(tweet.Likes, 10) || 0
  }));

  // Etkileşim dağılımı için verilerimz
  const interactionData = [
    { name: 'Beğeniler', value: tweets.reduce((sum, tweet) => sum + (parseInt(tweet.Likes, 10) || 0), 0) },
    { name: 'Retweet\'ler', value: tweets.reduce((sum, tweet) => sum + (parseInt(tweet.Retweets, 10) || 0), 0) },
    { name: 'Yorumlar', value: tweets.reduce((sum, tweet) => sum + (parseInt(tweet.Comments, 10) || 0), 0) }
  ];

  // Tweet uzunluğu ve etkileşim verileri
  const tweetLengthData = tweets.map(tweet => {
    const length = tweet.Content.length;
    const engagement = (parseInt(tweet.Likes, 10) || 0) + (parseInt(tweet.Retweets, 10) || 0) + (parseInt(tweet.Comments, 10) || 0);
    return { length, engagement };
  }).reduce((acc, { length, engagement }) => {
    const category = Math.floor(length / 50) * 50; // Her 50 karakter için bir kategori
    if (!acc[category]) {
      acc[category] = { category: `${category}-${category + 49}`, count: 0, totalEngagement: 0 };
    }
    acc[category].count++;
    acc[category].totalEngagement += engagement;
    return acc;
  }, {} as Record<number, { category: string; count: number; totalEngagement: number; }>);

  const tweetLengthChartData = Object.values(tweetLengthData).map(({ category, count, totalEngagement }) => ({
    category,
    averageEngagement: totalEngagement / count
  }));

  // Grafik label ayarları
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Twitter Analiz Görselleştirmesi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tweet ve Beğeni Zaman Çizelgesi */}
        <Card title="Tweet ve Beğeni Zaman Çizelgesi" className="shadow-lg">
          <LineChart width={300} height={200} data={timelineData}>
            <Line type="monotone" dataKey="tweets" stroke="#8884d8" name="Tweetler" />
            <Line type="monotone" dataKey="likes" stroke="#ff7300" name="Beğeniler" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </Card>

        {/* Etkileşim Dağılımı */}
        <Card title="Etkileşim Dağılımı" className="shadow-lg">
          <div className="flex flex-col items-center">
            <PieChart width={300} height={200}>
              <Pie
                data={interactionData}
                cx={150}
                cy={100}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {interactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <Legend
              payload={interactionData.map((item, index) => ({
                id: item.name,
                type: 'square',
                value: `${item.name}: ${item.value}`,
                color: COLORS[index % COLORS.length]
              }))}
            />
          </div>
        </Card>

        {/* Tweet Uzunluğu ve Ortalama Etkileşim */}
        <Card title="Tweet Uzunluğu ve Ortalama Etkileşim" className="shadow-lg">
          <BarChart width={300} height={200} data={tweetLengthChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageEngagement" fill="#8884d8" name="Ortalama Etkileşim" />
          </BarChart>
        </Card>
      </div>
    </div>
  );
};

export default Visualization;