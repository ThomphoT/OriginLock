import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import RotatingLogo from "@/components/RotatingLogo";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <RotatingLogo size={80} className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold gradient-text mb-3">404</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;