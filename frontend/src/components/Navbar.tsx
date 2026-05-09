import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, User, ChevronDown, LogOut, Settings } from "lucide-react";
import WalletConnect from "./WalletConnect";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();   


  const mockNotifications = [
    { id: "1", title: "Idea Verified", message: "Your idea has been verified on blockchain", time: "2m ago", unread: true },
    { id: "2", title: "New Certificate", message: "Certificate generated for your idea", time: "1h ago", unread: true },
    { id: "3", title: "Collaboration Request", message: "Maria Chen wants to collaborate", time: "3h ago", unread: false },
  ];

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className="glass-navbar sticky top-0 z-20 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ideas, certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm text-foreground bg-foreground/[0.04] border border-foreground/[0.06] rounded-xl focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card-strong rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-foreground/5">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-foreground/[0.03] transition-colors border-b border-foreground/[0.03] last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                        <div className={notif.unread ? "" : "ml-3.5"}>
                          <p className="text-xs font-medium text-foreground">{notif.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wallet */}
        <div className="hidden sm:block">
          <WalletConnect />
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
            className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl hover:bg-foreground/5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card-strong rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-foreground/5">
                  <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{user?.email || "user@originlock.io"}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate("/settings"); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors">
                  <Settings className="w-3.5 h-3.5" /> Settings
                  </button>
                  <button
                    onClick={async () => { await logout(); navigate("/login"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-400/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full glass-navbar p-3 sm:hidden z-20"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search ideas, certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-sm text-foreground rounded-xl input-glass"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;