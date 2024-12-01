import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

// Twitter'dan scrap edilen tweetlerin daha detaylı ele alınan kısmı

const TwitterAnalytics: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { username } = location.state;
  const { get } = useAPI();

  const fetchTweets = async () => {
    try {
      const response = await get(`http://localhost:8000/tweets/${username}`);
      const data = response as { tweets: Tweet[]; Success: boolean };

      if (data.Success) {
        setTweets(data.tweets);
        console.log("Fetched tweets:", data.tweets);
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

  useEffect(() => {
    fetchTweets();
  }, [get, username]);

  const parseValue = (value: string): number => {
    if (typeof value !== 'string') return 0;
    
    const cleanValue = value.trim().toUpperCase();
    if (cleanValue === '' || cleanValue === '-') return 0;

    const multipliers: { [key: string]: number } = {
      'B': 1000,
      'M': 1000000,
      'K': 1000
    };

    let numericValue = parseFloat(cleanValue.replace(/[^0-9.]/g, ''));
    const multiplier = multipliers[cleanValue.slice(-1)] || 1;

    return isNaN(numericValue) ? 0 : numericValue * multiplier;
  };

  const calculateTotal = (key: keyof Tweet) => tweets.reduce((acc, tweet) => acc + parseValue(tweet[key]), 0);

  const totalAnalytics = calculateTotal('Analytics');
  const totalComments = calculateTotal('Comments');
  const totalRetweets = calculateTotal('Retweets');
  const totalLikes = calculateTotal('Likes');

  console.log("Total Analytics:", totalAnalytics);
  console.log("Total Comments:", totalComments);
  console.log("Total Retweets:", totalRetweets);
  console.log("Total Likes:", totalLikes);

  if (loading) {
    // return <div className="text-center">Tweetler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Tweetler alınırken hata oluştu: {error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center gap-4">
          <Button icon={<FilterOutlined />} className="flex items-center">
            Filter
          </Button>
          <Button icon={<SortAscendingOutlined />} className="flex items-center">
            Sort
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-2xl font-bold">Twitter Analytics</div>
        <div className="text-gray-400">Analyze your Twitter performance and optimize your strategy</div>
      </div>

      <div className="flex flex-wrap justify-around gap-4 mb-4">
        <Card
          className="w-60 p-4 shadow-lg rounded-md border border-gray-200"
          title="Total Impressions"
          bordered={false}
          hoverable
        >
          <div className="text-3xl font-bold">{totalAnalytics.toLocaleString()}</div>
        </Card>

        <Card
          className="w-60 p-4 shadow-lg rounded-md border border-gray-200"
          title="Total Comments"
          bordered={false}
          hoverable
        >
          <div className="text-3xl font-bold">{totalComments.toLocaleString()}</div>
        </Card>

        <Card
          className="w-60 p-4 shadow-lg rounded-md border border-gray-200"
          title="Total Retweets"
          bordered={false}
          hoverable
        >
          <div className="text-3xl font-bold">{totalRetweets.toLocaleString()}</div>
        </Card>

        <Card
          className="w-60 p-4 shadow-lg rounded-md border border-gray-200"
          title="Total Likes"
          bordered={false}
          hoverable
        >
          <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
        </Card>
      </div>
    </div>
  );
};

export default TwitterAnalytics;