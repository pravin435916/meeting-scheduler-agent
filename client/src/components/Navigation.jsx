import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Calendar, Users, MessageSquare, Menu } from "lucide-react";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const tabs = [
    {
      id: "dashboard",
      icon: TrendingUp,
      label: "Dashboard",
      path: "/dashboard",
    },
    { id: "meetings", icon: Calendar, label: "Meetings", path: "/meetings" },
    { id: "users", icon: Users, label: "Users", path: "/users" },
    {
      id: "transcript",
      icon: MessageSquare,
      label: "Transcript Analysis",
      path: "/transcript",
    },
  ];

  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Voiceboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Intelligent Scheduling Agent
              </p>
            </div>
          </div>
          {/* Hamburger menu for mobile */}
          <div className="flex sm:hidden absolute right-4 top-4 sm:relative">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          {/* Desktop menu */}
          <div className="hidden sm:flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all ${
                  location.pathname === tab.path
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden">
            <div className="flex flex-col space-y-1 pb-3">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 border-l-4 transition-all ${
                    location.pathname === tab.path
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
