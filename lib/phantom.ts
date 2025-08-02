export interface PhantomProvider {
  isPhantom?: boolean
  publicKey?: { toString(): string }
  isConnected: boolean
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  on(event: string, callback: Function): void
  removeListener?(event: string, callback: Function): void
  request(method: string, params?: any): Promise<any>
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider
    }
  }
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window !== "undefined" && window.phantom?.solana) {
    const provider = window.phantom.solana
    if (provider.isPhantom) {
      return provider
    }
  }
  return null
}

export const connectPhantomWallet = async (): Promise<string> => {
  const provider = getPhantomProvider()

  if (!provider) {
    // Redirect to Phantom website if not installed
    window.open("https://phantom.app/", "_blank")
    throw new Error("Phantom wallet not found! Please install Phantom wallet extension.")
  }

  try {
    // This will trigger the Phantom popup for user confirmation
    const response = await provider.connect()
    const publicKey = response.publicKey.toString()

    return publicKey
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("User rejected the connection request")
    } else if (error.code === -32002) {
      throw new Error("Connection request already pending. Please check your Phantom wallet.")
    }
    throw new Error(`Failed to connect to Phantom wallet: ${error.message}`)
  }
}

export const disconnectPhantomWallet = async (): Promise<void> => {
  const provider = getPhantomProvider()

  if (provider && provider.isConnected) {
    try {
      await provider.disconnect()
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error)
      throw new Error(`Failed to disconnect wallet: ${error.message}`)
    }
  }
}

export const isPhantomInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.phantom?.solana?.isPhantom
}

export const isPhantomConnected = (): boolean => {
  const provider = getPhantomProvider()
  return provider?.isConnected || false
}

export const getConnectedWalletAddress = (): string | null => {
  const provider = getPhantomProvider()
  if (provider?.isConnected && provider.publicKey) {
    return provider.publicKey.toString()
  }
  return null
}

// Auto-connect if previously connected
export const autoConnectPhantom = async (): Promise<string | null> => {
  const provider = getPhantomProvider()

  if (!provider) return null

  try {
    // Try to connect silently if user previously connected
    const response = await provider.connect({ onlyIfTrusted: true })
    return response.publicKey.toString()
  } catch (error) {
    // User hasn't connected before or rejected auto-connect
    return null
  }
}
