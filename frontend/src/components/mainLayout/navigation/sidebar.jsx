import { useState } from "react";
import logoSidebar from "../../../assets/logoSidebar.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { doSignOut } from "../../../firebase/auth";
import {
  ArchiveBoxIcon,
  Bars3Icon,
  ChartBarIcon,
  ChartPieIcon,
  HomeIcon,
  PowerIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/16/solid";
import { Outlet } from "react-router-dom";
import LogoutConfirmationModal from "../logoutConfirmationModal";
import UserProfileDropdown from "./userProfile";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    doSignOut().then(() => {
      navigate("/signin");
    });
  };

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  // Titles based on route paths
  const titles = {
    "/dashboard": "Overview",
    "/inventory": "Inventory",
    "/sales-history": "Sales History",
    "/purchase-history": "Purchase History",
    "/attendance": "Attendance",
    "/analytics": "Analytics",
    "/new-customer": "New Customer",
  };

  let currentTitle = "Overview";

  if (titles[location.pathname]) {
    currentTitle = titles[location.pathname];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle */}
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-neutral-100 opacity-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-neutral-300 ${
          sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center">
          <img
            src={logoSidebar}
            alt="Biketopia"
            className="p-2 pb-1 text-neutral-900 text-center text-lg"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-1">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/dashboard")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <HomeIcon className="w-6 h-6 mr-3" />
            Overview
          </Link>

          <Link
            to="/inventory"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/inventory")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <ArchiveBoxIcon className="w-6 h-6 mr-3" />
            Inventory
          </Link>

          <Link
            to="/sales-history"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/sales-history")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <ChartBarIcon className="w-6 h-6 mr-3" />
            Sales History
          </Link>

          <Link
            to="/purchase-history"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/purchase-history")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <ShoppingBagIcon className="w-6 h-6 mr-3" />
            Purchase History
          </Link>

          <Link
            to="/attendance"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/attendance")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <UserGroupIcon className="w-6 h-6 mr-3" />
            Attendance
          </Link>

          <Link
            to="/analytics"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/analytics")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <ChartPieIcon className="w-6 h-6 mr-3" />
            Analytics
          </Link>

          <Link
            to="/new-customer"
            className={`flex items-center px-4 py-2 mt-2 mx-3 rounded-md ${
              isActive("/new-customer")
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-900 hover:text-neutral-100"
            } hover:bg-neutral-800`}
          >
            <UserPlusIcon className="w-6 h-6 mr-3" />
            New Customer
          </Link>

          <a
            onClick={handleLogout}
            className="flex items-center px-4 py-2 mt-2 mx-3 rounded-md text-neutral-900 hover:bg-neutral-900 hover:text-neutral-100 cursor-pointer"
          >
            <PowerIcon className="w-6 h-6 mr-3" />
            Logout
          </a>
        </nav>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex justify-between items-center p-4 bg-neutral-300 drop-shadow-sm z-50">
          <button
            className="lg:hidden text-neutral-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-neutral-800">
            {currentTitle}
          </h1>
          <div className="flex items-center space-x-2">
            <UserProfileDropdown onLogout={handleLogout} />
          </div>
        </header>

        {/* Pages Area*/}
        <div className="flex-grow overflow-y-auto pt-8 px-6 bg-neutral-100">
          <Outlet />
          <LogoutConfirmationModal
            isOpen={isLogoutModalOpen}
            onClose={closeModal}
            onConfirm={confirmLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;