"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Coins, TrendingUp, Users, Zap, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function UselessToken() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const tokenAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv"

  const copyTokenAddress = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Address Copied!",
      description: "Useless Token address copied to clipboard",
    })
  }

  const tokenomics = [
    { label: "Total Supply", value: "1,000,000,000 USELESS", icon: Coins },
    { label: "Circulating Supply", value: "420,690,000 USELESS", icon: TrendingUp },
    { label: "Holders", value: "6,969", icon: Users },
    { label: "Burned", value: "69,420,000 USELESS", icon: Zap },
  ]

  const features = [
    {
      title: "Completely Useless",
      description: "This token serves absolutely no purpose. That's the point!",
      icon: "🗑️",
    },
    {
      title: "Community Driven",
      description: "Built by useless people, for useless people. Join the useless revolution!",
      icon: "👥",
    },
    {
      title: "Meme Potential",
      description: "Perfect for creating the most useless memes on the internet.",
      icon: "🎭",
    },
    {
      title: "Zero Utility",
      description: "We guarantee this token will never have any real-world utility.",
      icon: "❌",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f1f1' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-800 shadow-lg" style={{ borderStyle: "dashed" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-800 hover:bg-gray-100 border-2 border-gray-600 rounded-lg transform -rotate-1"
              style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Useless Home</span>
            </Button>
          </Link>

          <h1
            className="text-2xl font-bold text-gray-900 transform rotate-1"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textShadow: "2px 2px 0px #ef4444",
            }}
          >
            $USELESS Token
          </h1>

          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <Card
          className="bg-gradient-to-br from-red-100 to-orange-100 border-3 border-gray-800 shadow-lg transform -rotate-0.5"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white transform rotate-12">
              <Coins className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              The Most Useless Token Ever Created
            </h2>
            <p className="text-xl text-gray-700 mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Finally, a cryptocurrency that admits it's completely pointless!
            </p>

            {/* Token Address */}
            <div
              className="bg-white p-4 rounded-lg border-2 border-gray-600 mb-6 transform rotate-1"
              style={{ borderStyle: "dashed" }}
            >
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                Contract Address:
              </p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded border">
                  {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-8)}
                </code>
                <Button
                  size="sm"
                  onClick={copyTokenAddress}
                  className="bg-red-600 hover:bg-red-700 text-white border-2 border-black"
                  style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-black transform hover:scale-105"
                style={{ borderStyle: "solid", fontFamily: "Comic Sans MS, cursive" }}
                onClick={() => window.open("https://dexscreener.com", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on DEX
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-600 bg-white text-gray-800 transform hover:scale-105"
                style={{ borderStyle: "dashed", fontFamily: "Comic Sans MS, cursive" }}
                onClick={() => window.open("https://phantom.app", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Buy on Phantom
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tokenomics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenomics.map((item, index) => (
            <Card
              key={item.label}
              className="bg-white border-3 border-gray-800 shadow-lg transform hover:scale-105 transition-all"
              style={{
                borderStyle: "dashed",
                transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1) * 0.5}deg)`,
              }}
            >
              <CardContent className="p-6 text-center">
                <item.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  {item.label}
                </h3>
                <p className="text-lg font-semibold text-gray-700" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card
          className="bg-white border-3 border-gray-800 shadow-lg transform rotate-0.3"
          style={{ borderStyle: "dashed" }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-900" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              Why Choose $USELESS?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-4 bg-gray-50 rounded-lg border-2 border-gray-300 transform"
                  style={{
                    borderStyle: "dashed",
                    transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.5}deg)`,
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {feature.title}
                      </h4>
                      <p className="text-gray-700" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card
          className="bg-yellow-50 border-3 border-yellow-500 shadow-lg transform -rotate-0.5"
          style={{ borderStyle: "dashed" }}
        >
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-yellow-800 mb-3" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              ⚠️ Important Disclaimer ⚠️
            </h3>
            <p className="text-yellow-700" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              $USELESS is a meme token created for entertainment purposes only. It has no intrinsic value, no utility,
              and no promise of returns. Please only invest what you can afford to lose (which should be nothing because
              it's useless). This is not financial advice - it's useless advice!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
