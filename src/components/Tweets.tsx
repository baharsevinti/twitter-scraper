import { CalendarOutlined, CommentOutlined, LikeOutlined, RetweetOutlined } from '@ant-design/icons';
import { Card } from "antd";
import Title from "antd/es/typography/Title";
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
}

// Twitter'dan scrap edilen tweetler ve tweet bilgilerini içeren componentımız.


const ScrapDetails: React.FC = () => {
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
      } else {
        throw new Error("Tweetler alınırken bir hata oluştu.");
      }
    } catch (err: unknown) {
      console.error("Tweetler alınırken hata oluştu:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Bilinmeyen bir hata oluştu");
      }
    } finally {
      setLoading(false);
    }

    console.log("Tweets:", tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, [get, username]);

  if (loading) {
    return <div className="text-center">Tweetler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Tweetler alınırken hata oluştu: {error}</div>;
  }

  return (
   <div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4" >
      {tweets.map((tweet, index) => (
        <Card
          key={index}
          className="bg-white shadow-lg rounded-lg p-4"
          title={<Title level={5}>{username}</Title>}
          extra={<a 
            href={tweet["Tweet Link"]} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500"
          >
            Tweet Linki
          </a>}
          actions={[
            <>
              <LikeOutlined key="likes" />
              <span>{tweet.Likes}</span>
            </>,
            <>
              <RetweetOutlined key="retweets" />
              <span>{tweet.Retweets}</span>
            </>,
            <>
              <CommentOutlined key="comments" />
              <span>{tweet.Comments}</span>
            </>
          ]}
        >
          <p className="mb-2">{tweet.Content}</p>

          <p className="text-gray-500">
            <CalendarOutlined /> {new Date(tweet.Timestamp).toLocaleDateString()}
          </p>

          {tweet.Photos.length > 0 && (
            <img
              src={tweet.Photos[0]}
              alt="Tweet Photo"
              className="w-full h-48 object-cover mt-4"
            />
          )}
        </Card>
      ))}
    </div>
   </div>
  );
};

export default ScrapDetails;
