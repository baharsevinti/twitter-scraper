import { Tabs } from 'antd';
import React from 'react';
import Orders from '../components/Orders';
import Tweets from '../components/Tweets';
import TwitterAnalytics from '../components/TwitterAnalytics';
import Visualization from '../components/Visualization';
const { TabPane } = Tabs;

const ScrapDetails: React.FC = () => {
  return (
    <div className="overflow-y-auto max-h-[70vh]">
      <Tabs defaultActiveKey="1" className="rounded-md shadow-md">
        <TabPane tab="Overview" key="1">
        <TwitterAnalytics />
        <Visualization />
        </TabPane>
        <TabPane tab="Tweets" key="2">
          <Tweets />
        </TabPane>
        <TabPane tab="Orders" key="3">
          <Orders />
        </TabPane>
      </Tabs>
      
    </div>
  );
};

export default ScrapDetails;
