import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  BookOpen,
  PlusCircle,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { resetCourse } from "../redox/slices/courseSlice";

import { ACCOUNT_TYPE } from "../utils/constants";
import { logOut } from "../services/operations/authAPI"

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (profileLoading || authLoading) {
    return <div className="spinner"></div>;
  }

  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR;
  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT;

  const commonLinks = [
    { to: "/dashboard/my-profile", icon: User, label: "My Profile" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const instructorLinks = [
    { to: "/dashboard/instructor", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/my-courses", icon: BookOpen, label: "My Courses" },
    { to: "/dashboard/add-course", icon: PlusCircle, label: "Add Course" },
    ...commonLinks,
  ];

  const studentLinks = [
    { to: "/dashboard/enrolled-courses", icon: BookOpen, label: "Enrolled Courses" },
    { to: "/dashboard/cart", icon: ShoppingCart, label: "Your Cart" },
    ...commonLinks,
  ];

  const links = isInstructor ? instructorLinks : studentLinks;

  const isActive = (path) => {
    if (path === "/dashboard/instructor") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logOut(navigate));
    setShowLogoutConfirm(false);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-16 inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 px-9 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white "
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  setSidebarOpen(false)
                  if (link.to === "/dashboard/add-course") {
                    dispatch(resetCourse())
                  }
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(link.to)
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-red-400 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <div className="flex-1 lg:ml-64">
          <header className="lg:hidden bg-gray-950 border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

             
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
