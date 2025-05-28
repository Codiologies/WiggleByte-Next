"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Shield, Lock, Eye, Database, Server, Key, FileText, AlertTriangle, Scale, Handshake, Clock } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: "INTRODUCTION",
      content: [
        "This Privacy Policy (\"Privacy Policy\") is published in compliance with inter alia: Section 43A of the Information Technology Act, 2000 (\"IT Act\"); Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (\"SPDI Rules\"); and Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011.",
        "This Privacy Policy deals with information we collect in relation to our Platform and explains:",
        "• What information we collect",
        "• How we collect and use that information",
        "• How you can provide information selectively",
        "• How you can access and update this information",
        "• How we process, share and protect your information",
        "The Platform is owned and managed by WiggleByte (\"We\" or \"Us\" or \"Our\"), a company engaged in the business of developing, testing, marketing and selling a wide variety of cybersecurity software and hardware (\"Services\")."
      ]
    },
    {
      icon: Lock,
      title: "INFORMATION WE COLLECT",
      content: [
        "We collect the following types of information about You:",
        "• User Information: name, email address, mobile number, company/organization, title, designation, physical addresses",
        "• Demographic Information: age, gender, current location details",
        "• Behavioural Information: usage statistics, traffic data, IP address, browser and operating system type, domain names, access times, locations",
        "• Indirect Information: information collected through third-party services",
        "We collect Your Information either directly from You through offline documentation and/or the Platform or indirectly by using different technologies."
      ]
    },
    {
      icon: Lock,
      title: "HOW WE USE YOUR INFORMATION",
      content: [
        "We use Your Information for the following purposes:",
        "• To operate and improve the Platform",
        "• To analyze data, track trends, and build algorithms",
        "• For research and development",
        "• For internal operational purposes",
        "• To provide regulatory updates",
        "• To invite You to seminars, webinars, and workshops",
        "• To comply with applicable laws",
        "• To investigate and prevent illegal activities",
        "• To respond to Your queries",
        "• To communicate important updates and notifications"
      ]
    },
    {
      icon: Eye,
      title: "INFORMATION SHARING",
      content: [
        "We may share Your Information with:",
        "• Our counterparties, consultants, and advisors",
        "• Authorized service providers and contractors",
        "• Partners and other Platform users (aggregated information)",
        "• Third parties outside India (when necessary)",
        "• Government entities (when legally required)",
        "We ensure that all third parties maintain appropriate security measures and confidentiality obligations."
      ]
    },
    {
      icon: Database,
      title: "DATA SECURITY",
      content: [
        "We implement various security measures to protect Your Information:",
        "• Physical, technical, and procedural safeguards",
        "• Regular security reviews and updates",
        "• Restricted access to Personal Information",
        "• Strict confidentiality obligations for employees and service providers",
        "• Secure data storage and transmission",
        "• Regular security audits and assessments"
      ]
    },
    {
      icon: Server,
      title: "YOUR RIGHTS",
      content: [
        "You have the right to:",
        "• Review and correct Your Personal Information",
        "• Update or change Your information",
        "• Request deletion of Your Personal Information",
        "• Opt-out of communications",
        "• Access Your data",
        "• Withdraw consent (subject to legal requirements)",
        "To exercise these rights, contact us at help@wigglebyte.com"
      ]
    },
    {
      icon: Key,
      title: "DATA RETENTION",
      content: [
        "We retain Your Personal Information:",
        "• For as long as necessary to serve the Purpose",
        "• For a maximum of 5 years after the Purpose is served",
        "• As required by applicable laws",
        "• For business purposes where necessary",
        "After retention period, data may be anonymized and aggregated",
        "You can request deletion by contacting us at connect@wigglebyte.com"
      ]
    },
    {
      icon: AlertTriangle,
      title: "THIRD-PARTY SERVICES",
      content: [
        "The Platform may contain links to third-party websites and services:",
        "• We have no control over third-party services",
        "• We are not responsible for their privacy practices",
        "• Review their privacy policies before use",
        "• Exercise caution when sharing information",
        "• We are not liable for third-party actions"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Your privacy is our priority. Learn how we protect and manage your data.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <section.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    {section.content.map((item, i) => (
                      <p key={i} className="leading-relaxed text-base">
                        {item.startsWith('•') ? (
                          <span className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-1.5">•</span>
                            <span>{item.substring(1).trim()}</span>
                          </span>
                        ) : (
                          item
                        )}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Grievance Officer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Grievance Officer
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed">
                  In accordance with the IT Act and the rules made thereunder, you may contact our Grievance Officer at:
                </p>
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <span className="font-medium">Email:</span> grievance@wigglebyte.com
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-medium">Address:</span> WiggleByte, 123 Security Street, Cyber City, 12345
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 