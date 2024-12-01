import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAPI } from '../services/api';
import "../styles/HomePage.css";


interface ScrapeResponse {
  message: string;
  task_id: string;
  Success: boolean;
}

function HomePage() {
  const [formData, setFormData] = useState({
    url: '',
    tweetCount: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate(); 

  const { post } = useAPI(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

 
  const extractUsername = (url: string) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = extractUsername(formData.url); 
    console.log("Extracted username:", username);

    try {
   
      const response = await post("http://localhost:8000/scrape/", {
        "username": username, 
        "tweet_count": Number(formData.tweetCount),
      }) as ScrapeResponse; 

     
      if (response.Success && response.task_id) {
        setResponseMessage(response.message);

        
        navigate('/scrape-details', { state: { taskId: response.task_id, username } });
      } else {
        throw new Error('Task initiation failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while initiating the scrape.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Twitter Scraper</h2>

        <div>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="https://x.com/username"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="tweetCount">Tweet Count</label>
          <input
            type="number"
            id="tweetCount"
            name="tweetCount"
            placeholder="50"
            value={formData.tweetCount}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
        </div>

        <button type="submit">Scrape</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default HomePage;
