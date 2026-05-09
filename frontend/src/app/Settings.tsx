import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Bell,
  Shield,
  Wallet,
  Globe,
  Moon,
  Key,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("creator@originlock.io");
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    verification: true,
    collaboration: false,
  });

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-4 text-sm text-foreground rounded-xl input-glass"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-4 text-sm text-foreground rounded-xl input-glass"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-secondary" />
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-3">
          <ToggleRow
            label="Email Notifications"
            description="Receive updates via email"
            checked={notifications.email}
            onChange={(v) => setNotifications({ ...notifications, email: v })}
          />
          <ToggleRow
            label="Browser Notifications"
            description="Show browser push notifications"
            checked={notifications.browser}
            onChange={(v) => setNotifications({ ...notifications, browser: v })}
          />
          <ToggleRow
            label="Verification Alerts"
            description="Get notified when ideas are verified"
            checked={notifications.verification}
            onChange={(v) => setNotifications({ ...notifications, verification: v })}
          />
          <ToggleRow
            label="Collaboration Requests"
            description="Receive collaboration invitations"
            checked={notifications.collaboration}
            onChange={(v) => setNotifications({ ...notifications, collaboration: v })}
          />
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-foreground/[0.03] transition-colors group">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">Change Password</p>
                <p className="text-[11px] text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-foreground/[0.03] transition-colors group">
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">Connected Wallet</p>
                <p className="text-[11px] text-muted-foreground">7xKX...m9Fk</p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400">Connected</span>
          </button>
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="btn-primary-glow flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-primary-foreground"
      >
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
};

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-all duration-200 relative ${
          checked ? "bg-primary" : "bg-foreground/10"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all duration-200 ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;