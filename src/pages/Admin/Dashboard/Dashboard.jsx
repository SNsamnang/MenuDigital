import React, { useState } from "react";
import Header from "../../../components/Header";
import Accordion from "../../../components/Accordion";
import Card from "../../../components/CardDashboard"; // Import the new Card component
import { users } from "../../../data/anachak";
import LineChartShop from "../../../components/LineChartComponent";
import PieChartComponent from "../../../components/PieChartComponent";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility, default to closed

  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
    console.log("Selected Menu:", menuItem);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex relative">
      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="absolute top-0 left-0 lg:w-[20%] md:w-[35%] sm:w-[50%] w-[60%] h-full z-50 bg-slate-200 shadow-lg">
            <Accordion onMenuClick={handleMenuClick} />
          </div>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        </>
      )}

      {/* Main Dashboard */}
      <div className="flex-1 bg-white h-screen flex flex-col">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} className="sticky top-0 z-50" />

        {/* Content */}
        <div className="flex-1 w-full p-4 overflow-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
            {/* Card Section */}
            <Card
              title="Products Item"
              icon="fas fa-list"
              value="10"
              link="/admin/products" // Add the link to the product page
            />
            <Card
              title="Category"
              icon="fas fa-table-cells-large"
              value="10"
              link="/admin/category" // Add the link to the category page
            />
            <Card
              title="All Users"
              icon="fas fa-user"
              value="10"
              link="/admin/users" // Add the link to the users page
            />
            {/* Card Section */}
            <Card
              title="All Shop"
              icon="fas fa-shop"
              value="10"
              link="/admin/shop" // Add the link to the shop page
            />
            <Card
              title="Image"
              icon="fas fa-image"
              value="10"
              link="/admin/image" // Add the link to the image page
            />
            <Card
              title="Social Media"
              icon="fas fa-globe"
              value="10"
              link="/admin/social-media" // Add the link to the social media page
            />
          </div>
          
          <div className="w-full m-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="border-[1px] border-orange-400 mt-5 col-span-1 lg:col-span-8">
              <h1 className="text-center text-orange-400 text-2xl p-3">All Shop in System</h1>
              <LineChartShop />
            </div>
            <div className="border-[1px] border-orange-400 p-3 mt-5 col-span-1 lg:col-span-4">
              <h1 className="text-center text-orange-400 text-2xl p-3">All Users in System</h1>
              <PieChartComponent />
            </div>
          </div>
        </div>
        {/* Chart users */}
      </div>
    </div>
  );
};

export default Dashboard;