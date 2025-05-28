"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { ArrowRight, CheckCircle, Download, Lock, ShieldCheck, Zap, Search, Users } from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  const [email, setEmail] = useState("");
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = 1;

  const handleWaitlistSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    toast.success("THANK YOU FOR JOINING OUR NEWSLETTER!", {
      description: "YOU WILL RECEIVE UPDATES ON OUR LATEST SECURITY SOLUTIONS.",
    });

    setEmail("");
  };

  return (
    <div key="home-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-gradient relative min-h-screen flex items-center justify-center pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <motion.div
            className="absolute inset-0 bg-[url('https://ext.same-assets.com/208135940/849522504.jpeg')] bg-cover bg-center opacity-30"
            style={{ y: backgroundY }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2657]/70 via-[#2496f8]/50 to-[#2acfcf]/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <h1 className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2496f8]/20 via-[#2acfcf]/20 to-[#2496f8]/20 blur-3xl -z-10"></div>
              
              <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-center">
                <motion.span 
                  className="block text-2xl md:text-3xl lg:text-4xl font-light text-white/80 mb-3 tracking-widest"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  THE WORLD'S FIRST
                </motion.span>
                
                <motion.span 
                  className="block mb-4 text-3xl md:text-4xl lg:text-5xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="bg-gradient-to-r from-[#2acfcf] via-white to-[#2496f8] bg-clip-text text-transparent">
                    CYBERSECURITY TOOL
                  </span>
                </motion.span>
                
                <motion.div 
                  className="mt-6 text-2xl md:text-3xl lg:text-4xl font-light text-white/90"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  THAT DETECTS EVERY THREAT{" "}
                  <motion.span 
                    className="font-bold text-[#2acfcf] relative inline-block text-3xl md:text-4xl lg:text-5xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    INSTANTLY
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-[#2acfcf] to-[#2496f8] rounded-lg blur opacity-75 -z-10"
                      animate={{ 
                        opacity: [0.75, 1, 0.75],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.span>
                </motion.div>
              </div>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
             
            </p>
          </motion.div>

          <motion.form
            id="waitlist"
            className="mt-10 max-w-md mx-auto flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleWaitlistSubmit}
          >
            <div className="flex gap-3 sm:flex-row items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ENTER YOUR EMAIL ADDRESS"
                className="px-4 py-3 h-12 rounded-md border border-gray-200 min-w-0 flex-1 outline-none focus:border-[#2496f8] focus:ring-2 focus:ring-[#2496f8]/60 bg-white text-gray-900 shadow"
              />
              <Button className="btn-primary h-12 px-6" type="submit">
                SUBSCRIBE
              </Button>
            </div>
          </motion.form>

          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-8 text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <Search size={28} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">THREAT DETECTION</h3>
              <p className="text-sm text-white/80">ML POWERED ANALYSIS CATCHES THREATS IN REAL-TIME</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap size={28} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">SIMPLE SETUP</h3>
              <p className="text-sm text-white/80">5-MIN INSTALLATION WITH ZERO CONFIGURATION NEEDED </p>
            </div>
            <div className="flex flex-col items-center">
              <Lock size={28} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">PRIVACY FIRST</h3>
              <p className="text-sm text-white/80">YOUR DATA STAYS SECURE WITH ENTERPRISE-GRADE ENCRYPTION</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight size={24} className="text-white/80 rotate-90" />
        </motion.div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm uppercase tracking-wider">
            Trusted by forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" className="h-6 md:h-8" />
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" className="h-6 md:h-8" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8u8BZcgcIxcfgSJsas_HDf2pfYTBlmo2q3g&s" alt="Microsoft" className="h-6 md:h-8" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4 text-[#1a2657] dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Meet Us
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              OUR AI-POWERED SECURITY SOLUTION MAKES ENTERPRISE-GRADE PROTECTION ACCESSIBLE FOR BUSINESSES OF ALL SIZES.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="feature-card dark:bg-gray-800 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-tr from-[#2496f8] to-[#3182dc] flex items-center justify-center">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">THREAT DETECTION</h3>
              <p className="text-gray-600 dark:text-gray-300">ML POWERED ANALYSIS CATCHES THREATS IN REAL-TIME</p>
            </motion.div>

            <motion.div
              className="feature-card dark:bg-gray-800 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-tr from-[#3182dc] to-[#2acfcf] flex items-center justify-center">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">EFFORTLESS INTEGRATION</h3>
              <p className="text-gray-600 dark:text-gray-300">5-MIN INSTALLATION WITH ZERO CONFIGURATION NEEDED</p>
            </motion.div>

            <motion.div
              className="feature-card dark:bg-gray-800 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-tr from-[#2acfcf] to-[#2496f8] flex items-center justify-center">
                <Lock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">PRIVACY FIRST</h3>
              <p className="text-gray-600 dark:text-gray-300">PLUG IN PEACE OF MIND-PRIVACY IN MINUTES</p>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/know-us">
              <Button variant="outline" className="rounded-full px-6">
                <span>See All </span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8] via-[#1d8ae3] to-[#1677c0] opacity-90" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
        
        {/* Animated Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium text-white uppercase tracking-wider">
                LIMITED TIME OFFER
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-ubuntu-mono uppercase">
              TRANSFORM YOUR SECURITY TODAY
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ENTERPRISE SECURITY</h3>
                <p className="text-sm text-white/80">BANK-GRADE PROTECTION FOR YOUR BUSINESS</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">INSTANT SETUP</h3>
                <p className="text-sm text-white/80">GET PROTECTED IN UNDER 5 MINUTES</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white"
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 SUPPORT</h3>
                <p className="text-sm text-white/80">EXPERT ASSISTANCE WHENEVER YOU NEED</p>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button asChild size="lg" className="bg-white text-[#2496f8] hover:bg-blue-50 px-8 py-6 text-lg rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Link href="/pricing">START FREE TRIAL</Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 px-8 py-6 text-lg rounded-full transform hover:scale-105 transition-all duration-200">
                  <Link href="/help">BOOK A DEMO</Link>
                </Button>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 text-white/80 text-sm"
            >
              NO CREDIT CARD REQUIRED • 7-DAY FREE TRIAL • CANCEL ANYTIME
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// This is a component for the Shield icon
interface ShieldProps extends Omit<React.SVGProps<SVGSVGElement>, 'size'> {
  size?: number;
}

function Shield({ className, size = 24, ...props }: ShieldProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
