"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Headset, MessageSquare, Search, ChevronDown, ChevronUp, BookOpen, Lock, Zap, Users, HelpCircle, ArrowRight, MessageCircle, LifeBuoy, PhoneCall, MessageSquareMore, Video, MessagesSquare, MessageSquareDot, Square } from "lucide-react";

export default function Help() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare email parameters
    const mailtoLink = `mailto:wigglebyte@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
    
    // Open email client with pre-filled information
    window.location.href = mailtoLink;
  };

  const openEmail = () => {
    window.location.href = "mailto:wigglebyte@gmail.com?subject=Support%20Request";
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/919914557798", "_blank");
  };

  const faqs = [
    {
      question: "HOW DO I GET STARTED WITH WIGGLEBYTE?",
      answer: "SIGN UP FOR A FREE TRIAL AND FOLLOW OUR ONBOARDING GUIDE. OUR TEAM IS AVAILABLE 24/7 FOR ASSISTANCE."
    },
    {
      question: "WHAT THREATS CAN WIGGLEBYTE DETECT?",
      answer: "WE DETECT MALWARE, PHISHING, DDoS ATTACKS, AND UNAUTHORIZED ACCESS USING ADVANCED AI TECHNOLOGY."
    },
    {
      question: "HOW DOES THE PRICING WORK?",
      answer: "CHOOSE FROM BASIC, PROFESSIONAL, OR ENTERPRISE PLANS. START WITH A FREE TRIAL TO TEST ALL FEATURES."
    },
    {
      question: "IS MY DATA SECURE WITH WIGGLEBYTE?",
      answer: "YES! WE USE BANK-GRADE ENCRYPTION AND FOLLOW INDUSTRY BEST PRACTICES FOR MAXIMUM SECURITY."
    }
  ];

  const knowledgeBase = [
    {
      icon: Lock,
      title: "SECURITY BASICS",
      description: "LEARN THE FUNDAMENTALS OF NETWORKING",
      link: "#"
    },
    {
      icon: Zap,
      title: "QUICK START GUIDE",
      description: "START USING WIGGLEBYTE IN MINUTES",
      link: "#"
    },
    {
      icon: Users,
      title: "TEAM MANAGEMENT",
      description: "LEARN HOW TO MANAGE YOUR TEAM'S ACCESS AND PERMISSIONS",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8] via-[#1d8ae3] to-[#1677c0] opacity-90" />
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          {/* Animated Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
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
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  YOUR SECURITY PARTNER
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 font-ubuntu-mono">
                SECURE YOUR DIGITAL FUTURE
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100 mb-12 font-ubuntu-mono uppercase">
                EXPERT CYBERSECURITY SUPPORT AT YOUR FINGERTIPS
              </p>
              
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="SEARCH......"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {knowledgeBase.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2496f8]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <item.icon className="h-12 w-12 text-[#2496f8] mb-6 transform group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-ubuntu-mono">
                FREQUENTLY ASKED QUESTIONS(FAQs)
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-white font-ubuntu-mono">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-6 w-6 text-[#2496f8]" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-[#2496f8]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-gray-600 dark:text-gray-300 font-ubuntu-mono">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-ubuntu-mono">
                GET IN TOUCH
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                OUR SUPPORT TEAM IS AVAILABLE 24/7 TO ASSIST YOU.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <LifeBuoy className="h-12 w-12 text-[#2496f8] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  EMAIL SUPPORT
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  
                </p>
                <Button 
                  onClick={openEmail}
                  className="bg-[#2496f8] hover:bg-[#1d8ae3] text-white transition-colors"
                >
                  CLICK HERE
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Square className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  CHAT SUPPORT
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  
                </p>
                <Button 
                  onClick={openWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  CLICK HERE
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Video className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  LIVE CHAT
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  
                </p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  CLICK HERE
                </Button>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                SEND US A MESSAGE
              </h3>
              <div>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-[#2496f8] focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2496f8] hover:bg-[#1d8ae3] text-white transition-colors"
              >
                SEND MESSAGE
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                WE WILL GET BACK TO YOU WITHIN 24 HOURS
              </p>
            </motion.form>
          </div>
        </section>
      </main>

      <Footer />

      {/* Fixed Contact Icons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
          className="bg-[#2496f8] text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-[#1d8ae3] transition-colors"
          onClick={openEmail}
        >
          <LifeBuoy className="h-6 w-6" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-green-700 transition-colors"
          onClick={openWhatsApp}
        >
          <Square className="h-6 w-6" />
        </motion.div>
      </div>
    </div>
  );
}