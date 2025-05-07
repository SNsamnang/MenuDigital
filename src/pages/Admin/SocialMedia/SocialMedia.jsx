import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import Accordion from "../../../components/Accordion";
import HeaderTable from "../../../components/HeaderTable";
import ContentTableSocial from "../../../components/ContentTableSocial";
import { fetchSocialContacts } from "../../../controller/socialMedia/socialController";

const SocialMedia = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [socialContacts, setSocialContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch social contacts data
  useEffect(() => {
    const loadSocialContacts = async () => {
      try {
        setLoading(true);
        const response = await fetchSocialContacts();
        if (response.success) {
          setSocialContacts(response.data);
          console.log("Social Contacts:", response.data);
        } else {
          toast.error(response.message || "Failed to fetch social contacts");
        }
      } catch (error) {
        console.error("Error loading social contacts:", error);
        toast.error("Failed to load social contacts");
      } finally {
        setLoading(false);
      }
    };

    loadSocialContacts();
  }, []);

  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter contacts based on search query
  const filteredContacts = searchQuery.trim()
    ? socialContacts.filter((contact) =>
        contact?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : socialContacts;

  return (
    <div className="w-full h-screen bg-slate-100 flex">
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
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          className="sticky top-0 z-50"
        />
        {/* Content */}
        <div className="flex-1 w-full overflow-auto scrollbar-hide">
          {/* Header Search & Add button */}
          <div className="w-full px-4 py-2 flex items-center justify-between sticky z-10 top-[-1px] bg-white">
            <input
              placeholder="Search social media..."
              className="h-10 w-[40%] bg-slate-200 rounded-md focus:outline-[1px] focus:outline-orange-400 p-3 text-sm lg:text-base"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Link to="/admin/add-social-media">
              <button className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm lg:text-base">
                <i className="fas fa-add mr-3"></i>Add Social
              </button>
            </Link>
          </div>
          {/* Table Content */}
          <div className="w-full px-4 lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] pb-5">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div>
                <HeaderTable
                  columns={[
                    { name: "No", width: "w-[5%] text-xs lg:text-sm" },
                    { name: "Social Name", width: "w-[20%] text-xs lg:text-sm" },
                    { name: "Link", width: "w-[20%] text-xs lg:text-sm" },
                    { name: "Shop", width: "w-[15%] text-xs lg:text-sm" },
                    { name: "Status", width: "w-[10%] text-xs lg:text-sm" },
                    { name: "Action", width: "w-[30%] text-xs lg:text-sm" },
                  ]}
                />
                <ContentTableSocial 
                  socialContacts={filteredContacts} 
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;