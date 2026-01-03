import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plane, Home, Map, Image, User, LogOut, BarChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav data-testid="navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-orange-500 rounded-full flex items-center justify-center">
              <Plane className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
              GlobeTrotter
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard">
              <Button
                data-testid="nav-dashboard"
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className={isActive("/dashboard") ? "bg-sky-500 hover:bg-sky-600" : ""}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/trips">
              <Button
                data-testid="nav-trips"
                variant={isActive("/trips") ? "default" : "ghost"}
                className={isActive("/trips") ? "bg-sky-500 hover:bg-sky-600" : ""}
              >
                <Map size={18} className="mr-2" />
                My Trips
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger data-testid="user-menu" asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-orange-500 text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="nav-profile" onClick={() => navigate("/profile")}>
                  <User size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="nav-admin" onClick={() => navigate("/admin")}>
                  <BarChart size={16} className="mr-2" />
                  Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}