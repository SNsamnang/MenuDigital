import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import Accordion from "../../../components/Accordion";
import HeaderTable from "../../../components/HeaderTable";
import ContentTableCategory from "../../../components/ContentTableCategory";
import Pagination from "../../../components/pagination";
import { fetchProductTypes } from "../../../controller/productType/productTypeController"; // Corrected import

const Category = () => {
  const [categories, setCategories] = useState([]); // Changed to categories
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 8; // Set items per page to 8
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchProductTypes(); // Fetch categories
        if (result.success) {
          setCategories(result.data || []);
        } else {
          console.error("Error fetching categories:", result.message);
        }
      } catch (error) {
        console.error("Error loading categories:", error.message || error);
      } finally {
        setLoading(false);
      }
    };
  
    loadCategories();
  }, []);

  const handleMenuClick = (menuItem) => {
    console.log("Selected Menu:", menuItem);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(
      (category) =>
        (category?.product_type || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (category?.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const filteredCategories = handleSearch();
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
              placeholder="Search"
              className="h-10 w-[40%] bg-slate-200 rounded-md focus:outline-[1px] focus:outline-orange-400 p-3 text-sm lg:text-base"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <Link to="/admin/add-category">
              <button className="bg-orange-400 text-white px-4 py-2 rounded-lg text-sm lg:text-base">
                <i className="fas fa-add mr-3"></i>Add Category
              </button>
            </Link>
          </div>
          {/* Table Content */}
          <div className="w-full px-4 lg:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] pb-5">
            {/* Conditionally render HeaderTable and ContentTable for larger screens */}
            <div>
              <HeaderTable
                columns={[
                  { name: "No", width: "w-[5%] text-xs lg:text-sm" },
                  { name: "Category", width: "w-[25%] text-xs lg:text-sm" },
                  { name: "Description", width: "w-[20%] text-xs lg:text-sm" },
                  { name: "Status", width: "w-[20%] text-xs lg:text-sm" },
                  { name: "Action", width: "w-[30%] text-xs lg:text-sm" },
                ]}
              />
              <ContentTableCategory categories={paginatedCategories} /> {/* Corrected prop */}
            </div>
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;