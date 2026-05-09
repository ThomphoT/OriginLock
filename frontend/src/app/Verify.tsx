import React from "react";
import { ShieldCheck } from "lucide-react";
import VerifyPanel from "@/components/VerifyPanel";

const Verify: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Verify Ownership</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Verify the authenticity and ownership of any registered idea on the blockchain
        </p>
      </div>
      <VerifyPanel />
    </div>
  );
};

export default Verify;