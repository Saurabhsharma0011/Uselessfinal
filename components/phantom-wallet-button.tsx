"use client"

import { useState, useEffect } from "react"
import { Wallet, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  connectPhantomWallet,
  disconnectPhantomWallet,
  isPhantomInstalled,
  isPhantomConnected,
  getConnectedWalletAddress,
  autoConnectPhantom,
} from "@/lib/phantom"
import { connectWallet } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface PhantomWalletButtonProps {
  onWalletConnected: (user: any, isNewUser: boolean) => void
  onWalletDisconnected: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function PhantomWalletButton({
  onWalletConnected,
  onWalletDisconnected,
  loading,
  setLoading,
}: PhantomWalletButtonProps) {
  const [phantomInstalled, setPhantomInstalled] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Check if Phantom is installed
        const installed = isPhantomInstalled()
        setPhantomInstalled(installed)

        if (!installed) {
          setInitializing(false)
          return
        }

        // Check current connection status
        const connected = isPhantomConnected()
        const address = getConnectedWalletAddress()

        if (connected && address) {
          // Already connected to Phantom
          setWalletConnected(true)
          setWalletAddress(address)

          // Sync with server
          try {
            const { user, isNewUser } = await connectWallet(address)
            onWalletConnected(user, isNewUser)
          } catch (error) {
            console.error("Failed to sync existing connection with server:", error)
          }
        } else {
          // Try auto-connect if previously authorized
          try {
            const autoAddress = await autoConnectPhantom()
            if (autoAddress) {
              setWalletConnected(true)
              setWalletAddress(autoAddress)

              // Connect to our server
              const { user, isNewUser } = await connectWallet(autoAddress)
              onWalletConnected(user, isNewUser)
            }
          } catch (error) {
            // Auto-connect failed, user needs to manually connect
            console.log("Auto-connect not available")
          }
        }
      } catch (error) {
        console.error("Error initializing wallet:", error)
      } finally {
        setInitializing(false)
      }
    }

    initializeWallet()

    // Listen for account changes
    if (window.phantom?.solana) {
      const provider = window.phantom.solana

      const handleAccountChanged = async (publicKey: any) => {
        if (publicKey) {
          const address = publicKey.toString()
          setWalletConnected(true)
          setWalletAddress(address)

          // Sync with server
          try {
            const { user, isNewUser } = await connectWallet(address)
            onWalletConnected(user, isNewUser)
          } catch (error) {
            console.error("Failed to sync account change with server:", error)
          }
        } else {
          setWalletConnected(false)
          setWalletAddress(null)
          onWalletDisconnected()
        }
      }

      const handleDisconnect = () => {
        setWalletConnected(false)
        setWalletAddress(null)
        onWalletDisconnected()
      }

      provider.on("accountChanged", handleAccountChanged)
      provider.on("disconnect", handleDisconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountChanged", handleAccountChanged)
          provider.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [onWalletConnected, onWalletDisconnected])

  const handleConnect = async () => {
    if (!phantomInstalled) {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom wallet extension to continue.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // This will show the Phantom popup for user confirmation
      const publicKey = await connectPhantomWallet()

      setWalletConnected(true)
      setWalletAddress(publicKey)

      // Save to server
      const { user, isNewUser } = await connectWallet(publicKey)
      onWalletConnected(user, isNewUser)

      toast({
        title: "Wallet Connected!",
        description: `Connected to ${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`,
      })
    } catch (error: any) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      await disconnectPhantomWallet()
      setWalletConnected(false)
      setWalletAddress(null)
      onWalletDisconnected()

      toast({
        title: "Wallet Disconnected",
        description: "Your Phantom wallet has been disconnected.",
      })
    } catch (error: any) {
      console.error("Disconnection error:", error)
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-600" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          Checking wallet...
        </div>
      </div>
    )
  }

  if (!phantomInstalled) {
    return (
      <div className="space-y-3">
        <Alert className="border-2 border-orange-500" style={{ borderStyle: "dashed" }}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Phantom wallet not detected. Please install it to connect.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => window.open("https://phantom.app/", "_blank")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-black transition-colors"
          style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Install Phantom Wallet
        </Button>
      </div>
    )
  }

  if (walletConnected && walletAddress) {
    return (
      <div className="space-y-2">
        <div
          className="text-center p-3 bg-green-50 border-2 border-green-500 rounded-lg"
          style={{ borderStyle: "dashed" }}
        >
          <p className="text-sm font-semibold text-green-800" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Connected to Phantom
          </p>
          <p className="text-xs text-green-600 font-mono">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </p>
        </div>
        <Button
          onClick={handleDisconnect}
          disabled={loading}
          variant="outline"
          className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 bg-transparent transition-colors"
          style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {loading ? "Disconnecting..." : "Disconnect Wallet"}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-black transition-colors"
      style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {loading ? "Connecting..." : "Connect Phantom Wallet"}
    </Button>
  )
}
