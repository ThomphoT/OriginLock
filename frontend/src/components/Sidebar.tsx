import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  PlusCircle,
  ShieldCheck,
  Users,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import logoImage from "@/assets/originlock-logo.jpeg";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ideas", label: "My Ideas", icon: Lightbulb },
  { path: "/new-idea", label: "Register Idea", icon: PlusCircle },
  { path: "/verify", label: "Verify Ownership", icon: ShieldCheck },
  { path: "/collaborations", label: "Collaborations", icon: Users, badge: 2 },
  { path: "/certificates", label: "Certificates", icon: Award },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-foreground/5 ${collapsed ? "justify-center px-3" : ""}`}>
        <img src={logoImage} alt="OriginLock" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <h1 className="text-sm font-bold text-foreground tracking-tight">OriginLock</h1>
            <p className="text-[10px] text-muted-foreground">Own Your Ideas</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative group ${
                isActive
                  ? "nav-link-active"
                  : "text-muted-foreground nav-link-hover"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-primary-light" : ""}`} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-light text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle - Desktop Only */}
      <div className="hidden lg:block px-3 py-4 border-t border-foreground/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen sticky top-0 glass-sidebar z-30"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] glass-sidebar z-50 lg:hidden"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;