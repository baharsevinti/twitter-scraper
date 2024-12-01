import { Card, Table } from "antd";
import React from "react";

// Verimizi rastgele oluşturuyoruz (10 tane olack şekilde)
const mockOrders = Array.from({ length: 10 }, (_, index) => ({
  key: index + 1,
  orderId: `ORD-${index + 1}`,
  product: `Product ${index + 1}`,
  quantity: Math.floor(Math.random() * 3) + 1,
  price: (Math.random() * 100).toFixed(2),
  orderDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
}));


// Order Geçmişini gösteren compnentimiz
const OrderHistory: React.FC = () => {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => <span className="font-medium text-blue-600">{text}</span>,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <span className="text-center">{quantity}</span>,
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (price: string) => <span className="font-bold text-green-500">${price}</span>,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-3xl font-bold text-gray-800">Order History</div>
        <div className="text-gray-500 text-lg">View your past orders and their details</div>
      </div>

      <Card className="rounded-md shadow-md border border-gray-300 w-full">
        <Table
          columns={columns}
          dataSource={mockOrders}
          pagination={false}
          rowClassName="hover:bg-blue-50 transition duration-200"
          scroll={{ x: true }} 
        />
      </Card>
    </div>
  );
};

export default OrderHistory;
