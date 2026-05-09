import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { formatWalletAddress } from "@/utils/format";

export function useWalletConnection() {
  const { publicKey, connected, connecting, disconnect, wallet } = useSolanaWallet();

  const formattedAddress = useMemo(() => {
    if (!publicKey) return "";
    return formatWalletAddress(publicKey.toBase58());
  }, [publicKey]);

  const fullAddress = useMemo(() => {
    if (!publicKey) return "";
    return publicKey.toBase58();
  }, [publicKey]);

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet,
    formattedAddress,
    fullAddress,
  };
}