"use client"
import { CheckCircle, Wifi, Zap, Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToastProvider } from "@/components/toast-provider"
import { toast } from "sonner"
import Link from "next/link"

const packages = [
  {
    id: 1,
    name: "Quick Browse",
    duration: "1 Hour",
    price: 10,
    speed: "2 Mbps",
    features: ["Basic browsing", "Social media", "Email access", "Standard support"],
    color: "yellow",
    popular: false,
    description: "Perfect for quick internet access and basic browsing needs.",
  },
  {
    id: 2,
    name: "Work Session",
    duration: "4 Hours",
    price: 15,
    speed: "3 Mbps",
    features: ["Video calls", "File downloads", "Streaming (SD)", "Priority support"],
    color: "green",
    popular: false,
    description: "Ideal for work sessions, video calls, and moderate usage.",
  },
  {
    id: 3,
    name: "Half Day",
    duration: "12 Hours",
    price: 20,
    speed: "4 Mbps",
    features: ["HD streaming", "Large downloads", "Gaming", "24/7 support"],
    color: "purple",
    popular: false,
    description: "Great for extended usage with faster speeds and HD streaming.",
  },
  {
    id: 4,
    name: "Full Day",
    duration: "24 Hours",
    price: 30,
    speed: "5 Mbps",
    features: ["Ultra-fast browsing", "4K streaming", "Unlimited downloads", "Premium support"],
    color: "blue",
    popular: true,
    description: "Our most popular package with maximum speed and unlimited access.",
  },
]

const PackageCard = ({ pkg }) => {
  const colorClasses = {
    yellow: "border-yellow-500 bg-yellow-500/5",
    green: "border-green-500 bg-green-500/5",
    purple: "border-purple-500 bg-purple-500/5",
    blue: "border-blue-500 bg-blue-500/5",
  }

  const handleSelectPackage = () => {
    toast.success(`${pkg.name} package selected!`, {
      description: `Redirecting to payment for Ksh ${pkg.price}`,
      duration: 3000,
    })
    // Redirect to home page with selected package
    setTimeout(() => {
      window.location.href = `/?package=${pkg.id}`
    }, 1500)
  }

  return (
    <Card
      className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        pkg.popular ? `${colorClasses[pkg.color]} shadow-lg` : "border-slate-200 dark:border-white/10"
      } bg-white/50 dark:bg-slate-800/50 backdrop-blur`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          <Wifi className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{pkg.name}</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">{pkg.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900 dark:text-white">
            Ksh {pkg.price}
            <span className="text-lg font-normal text-slate-600 dark:text-slate-400">/{pkg.duration}</span>
          </div>
        </div>

        {/* Speed & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
            <Zap className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">{pkg.speed}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Speed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
            <Clock className="w-5 h-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">{pkg.duration}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Duration</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">What's included:</h4>
          <ul className="space-y-2">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSelectPackage}
          className={`w-full h-12 font-semibold transition-all duration-300 ${
            pkg.popular
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
          }`}
        >
          Pay with M-Pesa - Ksh {pkg.price}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PackagesPage() {
  useDynamicTitle("WiFi Packages")
  
  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Choose Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Perfect Package
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Select from our range of affordable internet packages designed to meet your specific needs. All packages
              include secure M-Pesa payment and instant activation.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10,000+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Support</div>
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I pay?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Simply select your package and pay using M-Pesa. You'll receive instant access once payment is
                    confirmed.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is there a data limit?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    No, all our packages offer unlimited data usage during the specified time period.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I extend my session?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Yes, you can purchase additional time before your current session expires.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What if I have issues?</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Our support team is available 24/7 to help you with any connectivity or payment issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Connected?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of satisfied customers enjoying fast, reliable internet access.
                </p>
                <Link href="/">
                  <Button className="bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8 py-3">
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
