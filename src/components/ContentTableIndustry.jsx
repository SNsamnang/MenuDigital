import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate
import { deleteIndustry } from "../controller/industry/industryController";

const ContentTableIndustry = ({ industries }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState(""); // "success" or "error"
  const [industryToDelete, setIndustryToDelete] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  const handleEdit = (industry) => {
    navigate("/admin/add-industry", { state: { industry } }); // Navigate to AddIndustry with state
  };
  const handleDeleteClick = (industryId) => {
    setIndustryToDelete(industryId);
    setDialogMessage("Are you sure you want to delete this industry?");
    setDialogType("confirm");
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteIndustry(industryToDelete);
      if (result.success) {
        setDialogMessage("✅ Industry deleted successfully!");
        setDialogType("success");
      } else {
        setDialogMessage(`❌ Failed to delete the industry: ${result.message}`);
        setDialogType("error");
      }
    } catch (error) {
      console.error("Error deleting industry:", error);
      setDialogMessage("❌ An unexpected error occurred while deleting the industry.");
      setDialogType("error");
    } finally {
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    if (dialogType === "success") {
      window.location.reload();
    }
  };

  return (
    <div className="w-full border-t-[1px] border-white">
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
                    onClick={() => setShowDialog(false)}
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

      {industries.map((industry, index) => (
        <div
          key={industry.id}
          className="w-full h-12 bg-slate-200 flex items-center px-2 mb-[1px]"
        >
          <p className="text-gray-600 w-[5%] text-center text-ellipsis">{index + 1}</p>
          <p className="text-gray-600 w-[25%] text-center text-ellipsis">{industry.Industry}</p>
          <p className="text-gray-600 w-[20%] text-center text-ellipsis">{industry.Description}</p>
          <p className="text-gray-600 w-[20%] text-center text-ellipsis">
            <span>
              <i
                className={`fa-solid fa-circle text-[10px] p-2 ${
                  industry.status ? "text-green-500" : "text-red-500"
                }`}
              ></i>
            </span>
          </p>
          <div className="w-[30%] flex justify-center">
            {/* Edit Button */}
            <button
                className="rounded-lg w-7 h-7 hover:bg-slate-300"
                onClick={() => handleEdit(industry)} // Assuming you have a handleEdit function to navigate to the edit page
              >
                <i className="fa-solid fa-pen-to-square text-orange-400"></i>
              </button>
            <button
              className="rounded-lg w-7 h-7 hover:bg-slate-300"
              onClick={() => handleDeleteClick(industry.id)}
            >
              <i className="fa-solid fa-trash text-red-400"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentTableIndustry;