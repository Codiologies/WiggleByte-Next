"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ClientBody({ children }: { children: React.ReactNode }) {
  return <div key="client-body-wrapper">{children}</div>;
}
