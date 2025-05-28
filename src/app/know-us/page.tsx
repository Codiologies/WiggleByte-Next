"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Award, Heart, Target, ArrowRight, Sparkles, Globe, Users, Lock, Zap, Star, Rocket, Lightbulb, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function KnowUs() {
  const values = [
    {
      icon: Lock,
      title: "SECURITY FIRST",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Award,
      title: "EXCELLENCE",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "CUSTOMER FOCUS",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Target,
      title: "INNOVATION",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "THREAT PROTECTION",
      description: "DETECTS THREATs IN YOUR WEBSITE BY ENTERING YOUR WEBSITE URL."
    },
    {
      icon: Globe,
      title: "GLOBAL COVERAGE",
      description: "PROTECTING BUSINESSES ACROSS 50+ COUNTRIES WITH LOCALIZED SUPPORT"
    },
    {
      icon: Users,
      title: "DEDICATED SUPPORT",
      description: "24/7 EXPERT ASSISTANCE FROM OUR TEAM OF CYBERSECURITY EXPERTS"
    },
    {
      icon: Lock,
      title: "ENTERPRISE SECURITY",
      description: "BANK-GRADE ENCRYPTION FOR THE MAXIMUM PROTECTION"
    },
    {
      icon: Zap,
      title: "REAL-TIME MONITORING",
      description: "INSTANT THREAT DETECTION AND AUTOMATED RESPONSE SYSTEMS"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Lock },
    { number: "24/7", label: "Support", icon: Heart },
    { number: "50+", label: "Countries", icon: Globe }
  ];

  const startupAdvantages = [
    {
      icon: Award,
      title: "INNOVATIVE APPROACH",
      description: "BEING A STARTUP ALLOWS US TO TEST  THE LATEST TECHNOLOGIES WITHOUT LAGGING BEHIND."
    },
    {
      icon: Lightbulb,
      title: "FRESH PERSPECTIVE",
      description: "OUR NEW PERSPECTIVE BRINGS INNOVATIVE SOLUTIONS TO AGE-OLD SECURITY CHALLENGES."
    },
    {
      icon: TrendingUp,
      title: "GROWING WITH YOU",
      description: "THE FOCUS IS ON GROWING WITH YOU AND NOT JUST SELLING YOU A PRODUCT. "
    },
    {
      icon: Lock,
      title: "FUTURE-FOCUSED",
      description: "THE NEXT GENERATION CYBERSECURITY TOOL THAT DETECTS EVERY THREATS IN REAL-TIME."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8] via-[#1d8ae3] to-[#1677c0] opacity-90" />
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          {/* Animated Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-full h-full bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block mb-6"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium uppercase">
                  TRUSTED BY 500+ BUSINESSES WORLDWIDE
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 font-ubuntu-mono uppercase">
                MEET WIGGLEBYTE
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100 mb-12 uppercase">
                REVOLUTIONIZING CYBERSECURITY FOR SMALL AND MEDIUM BUSINESSES THROUGH INNOVATIVE AI TECHNOLOGY.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-[#2496f8] bg-white rounded-full hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg uppercase"
                >
                  GET STARTED FREE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200 uppercase"
                >
                  VIEW PRICING
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-ubuntu-mono uppercase">
                WHY CHOOSE WIGGLEBYTE?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto uppercase">
                EXPERIENCE THE FUTURE OF CYBERSECURITY WITH OUR CUTTING-EDGE FEATURES
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <feature.icon className="h-12 w-12 text-[#2496f8] mb-6 transform group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-ubuntu-mono uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 uppercase">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-[#2496f8] to-[#1d8ae3] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-ubuntu-mono uppercase">
                OUR CORE VALUES
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto uppercase">
                THE PRINCIPLES THAT DRIVE OUR INNOVATION AND SUCCESS
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl h-full transform group-hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                    <value.icon className="h-12 w-12 text-[#2496f8] mb-6 transform group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-ubuntu-mono uppercase">
                      {value.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Replace Reviews Section with Why Start with Us Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-ubuntu-mono uppercase">
                WHY START WITH US
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto uppercase">
                JOIN US ON OUR JOURNEY TO REVOLUTIONIZE CYBERSECURITY
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {startupAdvantages.map((advantage, index) => (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8] to-[#1d8ae3] rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform group-hover:-translate-y-1 transition-all duration-300 p-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2496f8] to-[#1d8ae3] flex items-center justify-center text-white">
                          <advantage.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-ubuntu-mono uppercase">
                          {advantage.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 uppercase">
                          {advantage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <Link
                href="/pricing"
                className="inline-flex items-center text-[#2496f8] hover:text-[#1d8ae3] font-medium uppercase"
              >
                JOIN OUR JOURNEY
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8] to-[#1d8ae3]" />
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-ubuntu-mono uppercase">
                READY TO TRANSFORM YOUR SECURITY?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto uppercase">
                JOIN HUNDREDS OF BUSINESSES THAT TRUST WIGGLEBYTE FOR THEIR CYBERSECURITY NEEDS. START YOUR JOURNEY TO BETTER SECURITY TODAY.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-[#2496f8] bg-white rounded-full hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 hover:shadow-lg uppercase"
                >
                  START FREE TRIAL
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200 uppercase"
                >
                  CONTACT SALES
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 