import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import SplashScreen from "./components/SplashScreen";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./app/Dashboard";
import Ideas from "./app/Ideas";
import NewIdea from "./app/NewIdea";
import Verify from "./app/Verify";
import Certificates from "./app/Certificates";
import Settings from "./app/Settings";
import Collaborations from "./app/Collaborations";
import Login from "./app/Login";
import Register from "./app/Register";
import NotFound from "./pages/NotFound";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@/styles/theme.css";

const App: React.FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SplashScreen>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/new-idea" element={<NewIdea />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/collaborations" element={<Collaborations />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </SplashScreen>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(222 50% 8%)",
                color: "hsl(213 31% 97%)",
                border: "1px solid hsl(220 30% 15%)",
                borderRadius: "0.75rem",
                fontSize: "0.8125rem",
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: "hsl(142 71% 45%)",
                  secondary: "hsl(222 50% 8%)",
                },
              },
              error: {
                iconTheme: {
                  primary: "hsl(0 84% 60%)",
                  secondary: "hsl(222 50% 8%)",
                },
              },
            }}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;