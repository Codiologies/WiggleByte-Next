"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { FileText, AlertTriangle, Scale, Shield, Handshake, Clock, Globe, Copyright, Database, Users, Lock, LucideIcon } from "lucide-react";

interface Section {
  icon: LucideIcon;
  title: string;
  content: string[];
}

export default function TermsOfUse() {
  const sections: Section[] = [
    {
      icon: FileText,
      title: "INTRODUCTION",
      content: [
        "The use of any product, service or feature (the \"Materials\") available through the internet websites accessible at wigglebyte.com (collectively, the \"Website\") by any user of the Website (\"You\" or \"Your\" hereafter) shall be governed by the following terms of use:",
        "This Website is provided by WiggleByte, a company incorporated under the Companies Act, and shall be used for informational purposes only. By using the Website or downloading Materials from the Website, You hereby agree to abide by the terms and conditions set forth in this Terms of Use. In the event of You not agreeing to these terms and conditions, You are requested by WiggleByte not to use the Website or download Materials from the Website."
      ]
    },
    {
      icon: Copyright,
      title: "COPYRIGHT AND INTELLECTUAL PROPERTY",
      content: [
        "This Website, including all Materials present (excluding any applicable third party materials), is the property of WiggleByte and is copyrighted and protected by worldwide copyright laws and treaty provisions. You hereby agree to comply with all copyright laws worldwide in Your use of this Website and to prevent any unauthorized copying of the Materials.",
        "WiggleByte does not grant any express or implied rights under any patents, trademarks, copyrights or trade secret information."
      ]
    },
    {
      icon: Users,
      title: "BUSINESS RELATIONSHIPS",
      content: [
        "WiggleByte has business relationships with thousands of customers, suppliers, governments, and others. For convenience and simplicity, words like joint venture, partnership, and partner are used to indicate business relationships involving common activities and interests, and those words may not indicate precise legal relationships."
      ]
    },
    {
      icon: Scale,
      title: "LIMITED LICENSE",
      content: [
        "Subject to the terms and conditions set forth in these Terms of Use, WiggleByte grants You a non-exclusive, non-transferable, limited right to access, use and display this Website and the Materials thereon. You agree not to interrupt or attempt to interrupt the operation of the Website in any manner.",
        "Unless otherwise specified, the Website is for Your personal and non-commercial use. You shall not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from this Website."
      ]
    },
    {
      icon: AlertTriangle,
      title: "PROHIBITED ACTIVITIES",
      content: [
        "You agree not to:",
        "• Use the service for any illegal purposes",
        "• Attempt to breach or circumvent security measures",
        "• Interfere with service operation or other users",
        "• Share account credentials or access",
        "• Use automated systems to access the service",
        "• Attempt to reverse engineer our technology",
        "• Defame, abuse, harass or threaten others",
        "• Post inappropriate or unlawful content",
        "• Use profane or objectionable language",
        "• Reveal confidential information",
        "• Conduct unauthorized contests",
        "• Upload malicious files or software",
        "• Create false identities",
        "• Deface or vandalize the Website"
      ]
    },
    {
      icon: Database,
      title: "THIRD PARTY CONTENT",
      content: [
        "The Website may make available third-party content including articles, reports, tools, and data (\"Third Party Content\"). You acknowledge that:",
        "• Third Party Content is not created or endorsed by WiggleByte",
        "• Content is for informational purposes only",
        "• No guarantees are made regarding accuracy or completeness",
        "• You use such content at your own risk",
        "• WiggleByte is not liable for any decisions made based on such content"
      ]
    },
    {
      icon: Lock,
      title: "NO WARRANTIES",
      content: [
        "This website, the information and materials on the site, and any software made available on the Website, are provided \"as is\" without any representation or warranty, express or implied, of any kind, including, but not limited to, warranties of merchantability, non-infringement, or fitness for any particular purpose.",
        "There is no warranty of any kind, express or implied, regarding third party content. In spite of WiggleByte's best endeavors, there is no warranty that this Website will be free of any computer viruses."
      ]
    },
    {
      icon: Handshake,
      title: "LIMITATION OF DAMAGES",
      content: [
        "In no event shall WiggleByte or any of its subsidiaries or affiliates be liable to any entity for any direct, indirect, special, consequential or other damages (including, without limitation, any lost profits, business interruption, loss of information or programs or other data on your information handling system) that are related to the use of, or the inability to use, the content, materials, and functions of this Website or any linked Website, even if WiggleByte is expressly advised of the possibility of such damages."
      ]
    },
    {
      icon: Globe,
      title: "INTERNATIONAL USERS AND CHOICE OF LAW",
      content: [
        "This Site is controlled, operated and administered by WiggleByte. WiggleByte makes no representation that Materials on this Website are appropriate or available for use at other locations.",
        "These Terms of Use shall be governed by applicable laws. You agree that the appropriate courts will have the exclusive jurisdiction to resolve all disputes arising under these Terms of Use.",
        "Any claim You may have with respect to Your use of the Website must be commenced within one (1) year of the cause of action."
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
                Terms of Use
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Please read these terms carefully before using our services.
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
                  <div className="flex items-center gap-4 mb-6">
                    <section.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    {section.content.map((item, i) => (
                      <p key={i} className="leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
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