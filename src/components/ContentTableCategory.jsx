import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProductType } from "../controller/productType/productTypeController";
import { supabase } from "../supabaseClient";

const ContentTableCategory = ({ categories }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRoleAndFilterCategories = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
        if (sessionError || !session) {
          console.error("Error fetching session:", sessionError?.message);
          return;
        }
  
        // Get user data with role information
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select(`
            id,
            roleId,
            Roles:roleId (
              role
            )
          `)
          .eq("authId", session.user.id)
          .single();
  
        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }
  
        console.log("User data:", userData);
        const userRole = userData.Roles?.role?.toLowerCase();
        console.log("User role:", userRole);
        console.log("User ID:", userData.id);
  
        setRole(userRole);
        setUserId(userData.id);
  
        // Now filter categories based on role
        let visibleCategories;
        if (userRole === "super admin") {
          // Show all categories for super admin
          visibleCategories = categories;
          console.log("Super admin - showing all categories:", categories);
        } else {
          // Filter categories to show only those added by the current user
          visibleCategories = categories.filter(category => {
            console.log("Category:", category);
            // Changed userid to userId to match the actual field name
            return Number(category.userId) === Number(userData.id);
          });
          console.log("Regular user - showing own categories:", visibleCategories);
        }
  
        setFilteredCategories(Array.isArray(visibleCategories) ? visibleCategories : []);
  
      } catch (err) {
        console.error("Unexpected error:", err);
        setFilteredCategories([]);
      }
    };
  
    if (Array.isArray(categories) && categories.length > 0) {
      fetchUserRoleAndFilterCategories();
    } else {
      setFilteredCategories([]);
    }
  }, [categories]);

  const handleEdit = (category) => {
    navigate("/admin/add-category", { state: { category } });
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setDialogMessage("Are you sure you want to delete this category?");
    setDialogType("confirm");
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteProductType(categoryToDelete);
      if (result.success) {
        setDialogMessage("✅ Category deleted successfully!");
        setDialogType("success");

        // Update state to remove deleted category
        setFilteredCategories((prev) =>
          prev.filter((cat) => cat.id !== categoryToDelete)
        );
      } else {
        setDialogMessage(`❌ Failed to delete the category: ${result.message}`);
        setDialogType("error");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setDialogMessage("❌ An unexpected error occurred.");
      setDialogType("error");
    } finally {
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="w-full border-t border-white">
      {/* Confirmation / Result Dialog */}
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-gray-800">{dialogMessage}</p>
            <div className="mt-4 flex justify-center gap-4">
              {dialogType === "confirm" ? (
                <>
                  <button
                    className="px-4 py-2 bg-orange-400 text-white rounded-md"
                    onClick={handleConfirmDelete}
                  >
                    OK
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-orange-400 text-white rounded-md"
                  onClick={handleDialogClose}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table List */}
      {filteredCategories.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No categories found.</p>
      ) : (
        filteredCategories.map((category, index) => (
          <div
            key={category.id}
            className="w-full h-12 bg-slate-200 flex items-center px-2 mb-[1px]"
          >
            <p className="text-gray-600 w-[5%] text-center">{index + 1}</p>
            <p className="text-gray-600 w-[25%] text-center text-ellipsis">
              {category.product_type}
            </p>
            <p className="text-gray-600 w-[20%] text-center text-ellipsis">
              {category.description}
            </p>
            <p className="text-gray-600 w-[20%] text-center">
              <i
                className={`fa-solid fa-circle text-[10px] p-2 ${
                  category.status ? "text-green-500" : "text-red-500"
                }`}
              ></i>
            </p>
            <div className="w-[30%] flex justify-center gap-3">
              <button
                className="rounded-lg w-7 h-7 hover:bg-slate-300"
                onClick={() => handleEdit(category)}
              >
                <i className="fa-solid fa-pen-to-square text-orange-400"></i>
              </button>
              <button
                className="rounded-lg w-7 h-7 hover:bg-slate-300"
                onClick={() => handleDeleteClick(category.id)}
              >
                <i className="fa-solid fa-trash text-red-400"></i>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContentTableCategory;