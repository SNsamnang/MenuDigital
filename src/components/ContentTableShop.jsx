import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { deleteShop } from "../controller/shop/shopController";
import { supabase } from "../supabaseClient";

const ContentTableShop = ({ shops }) => {
  const navigate = useNavigate();

  // State for dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState(""); // "success" or "error"
  const [shopToDelete, setShopToDelete] = useState(null);

  // State for user role and filtered shops
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filteredShops, setFilteredShops] = useState([]);

  useEffect(() => {
    const fetchUserRoleAndFilterShops = async () => {
      try {
        // Fetch the current user's role and ID
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("Authentication error:", authError);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select(
            `
            id,
            roleId,
            Roles:roleId (role)
          `
          )
          .eq("authId", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user role:", userError);
          return;
        }

        const userRole = userData.Roles?.role?.toLowerCase();
        setUserRole(userRole);
        setCurrentUserId(userData.id);

        // Filter shops based on role
        if (userRole === "super admin") {
          setFilteredShops(shops); // Show all shops for super admin
        } else {
          const userShops = shops.filter((shop) => shop.userId === userData.id);
          setFilteredShops(userShops); // Show only user's own shops
        }
      } catch (error) {
        console.error("Error fetching user role or filtering shops:", error);
      }
    };

    fetchUserRoleAndFilterShops();
  }, [shops]);

  const handleEdit = (shop) => {
    navigate("/admin/add-shop", { state: { shop } });
  };

  const handleDeleteClick = (shopId) => {
    setShopToDelete(shopId);
    setDialogMessage("Are you sure you want to delete this shop?");
    setDialogType("confirm"); // Set dialog type to "confirm"
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let result = await deleteShop(shopToDelete);

      if (result.success) {
        setDialogMessage("✅ Shop deleted successfully!");
        setDialogType("success"); // Set dialog type to "success"
      } else {
        setDialogMessage(`❌ Failed to delete the shop: ${result.message}`);
        setDialogType("error"); // Set dialog type to "error"
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
      setDialogMessage(
        "❌ An unexpected error occurred while deleting the shop."
      );
      setDialogType("error"); // Set dialog type to "error"
    } finally {
      setShowDialog(true); // Show the dialog with the result
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false); // Close the dialog

    // Refresh the page if the dialog type is "success"
    if (dialogType === "success") {
      window.location.reload();
    }
  };
  const handleShopClick = (shopId) => {
    navigate(`/menu/${shopId}`); // Navigate to the Menu page with shopId
  };

  return (
    <div className="w-full border-t-[1px] border-white">
      {/* Dialog */}
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-gray-800">{dialogMessage}</p>
            <div className="mt-4 flex justify-center gap-4">
              {dialogType === "confirm" ? (
                <>
                  <button
                    className="px-4 py-2 bg-orange-400 text-white rounded-md"
                    onClick={handleConfirmDelete} // Confirm deletion
                  >
                    OK
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                    onClick={() => setShowDialog(false)} // Cancel deletion
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-orange-400 text-white rounded-md"
                  onClick={handleDialogClose} // Close dialog and refresh if success
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {filteredShops.map((shop, index) => {
        const industryName = shop.Industry ? shop.Industry.Industry : "Unknown";
        return (
          <div
            className="w-full h-12 bg-slate-200 flex items-center px-2 mb-[1px] cursor-pointer hover:bg-slate-300"
            key={shop.id}
            onClick={() => handleShopClick(shop.id)}
          >
            <p className="text-gray-600 w-[5%] text-center text-ellipsis">
              {index + 1}
            </p>
            <p className="text-gray-600 w-[25%] text-center font-bold text-ellipsis">
              {shop.name || "Unknown"}
            </p>
            <div className="w-[10%] flex justify-center items-center">
              <img
                className="h-9 w-9 rounded-md"
                src={shop.profile}
                alt="Profile"
              />
            </div>
            <p className="text-gray-600 w-[20%] text-center text-ellipsis">
              {industryName}
            </p>
            <p className="text-gray-600 w-[15%] text-center text-ellipsis">
              {shop.Users ? shop.Users.username : "Unknown"}
            </p>
            <p className="text-gray-600 w-[10%] text-center">
              <span>
                <i
                  className={`fa-solid fa-circle text-[10px] p-2 ${
                    shop.status ? "text-green-500" : "text-red-500"
                  }`}
                ></i>
              </span>
            </p>
            <div className="w-[15%] flex justify-center">
              {/* Edit Button */}
              <button
                className="rounded-lg w-7 h-7 hover:bg-slate-300"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  handleEdit(shop);
                }}
              >
                <i className="fa-solid fa-pen-to-square text-orange-400"></i>
              </button>
              {/* Delete Button */}
              <button
                className="rounded-lg w-7 h-7 hover:bg-slate-300"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  handleDeleteClick(shop.id);
                }}
              >
                <i className="fa-solid fa-trash text-red-400"></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentTableShop;
