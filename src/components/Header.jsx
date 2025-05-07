import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Fetch the username for the current user
  const fetchUser = async (currentUser) => {
    if (!currentUser?.email) return;

    const { data, error } = await supabase
      .from("Users")
      .select("username")
      .eq("email", currentUser.email)
      .single();

    if (error) {
      console.error("Error fetching username:", error.message);
      setUsername(""); // fallback if error
    } else {
      setUsername(data?.username || ""); // update username
    }
  };

  useEffect(() => {
    // Get session on component mount
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        fetchUser(currentUser);
      }
    };

    getSession();

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          fetchUser(currentUser);
        } else {
          setUsername(""); // Clear if logged out
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe?.();
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="w-full h-14 bg-white flex items-center justify-between px-4 border-b-2 border-slate-100">
      <div className="flex items-center">
        <i
          onClick={toggleSidebar}
          className="text-orange-400 fas fa-bars text-xl cursor-pointer"
        ></i>
      </div>
      <div className="flex items-center">
        <h3 className="text-xl font-semibold mr-3">
          {username || (user ? user.email : "Guest")}
        </h3>
        <div className="relative z-30">
          <div
            className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-400 hover:border-orange-500 hover:border"
            onClick={toggleDropdown}
          >
            <i className="fas fa-user text-white"></i>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded shadow-lg">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer ">
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
