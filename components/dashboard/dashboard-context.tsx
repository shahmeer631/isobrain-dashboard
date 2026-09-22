
// "use client"

// import * as React from "react"

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

// interface DashboardContextType {
//   isCollapsed: boolean
//   toggleCollapse: () => void
//   isMobile: boolean
// }

// const DashboardContext = React.createContext<DashboardContextType>({
//   isCollapsed: false,
//   toggleCollapse: () => {},
//   isMobile: false,
// })

// export function DashboardProvider({ children }: { children: React.ReactNode }) {
//   const [isCollapsed, setIsCollapsed] = React.useState(false)
//   const [isMobile, setIsMobile] = React.useState(false)

//   const toggleCollapse = React.useCallback(() => {
//     setIsCollapsed((prev) => !prev)
//   }, [])

//   // Check for mobile screen size
//   React.useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//       if (window.innerWidth < 768) {
//         setIsCollapsed(false) // Reset collapse on mobile
//       }
//     }
    
//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   return (
//     <DashboardContext.Provider value={{ isCollapsed, toggleCollapse, isMobile }}>
//       <TooltipProvider delayDuration={0}>
//         {children}
//       </TooltipProvider>
//     </DashboardContext.Provider>
//   )
// }

// export const useDashboard = () => React.useContext(DashboardContext)


"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobile: boolean;
}

const DashboardContext = React.createContext<DashboardContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
  isMobile: false,
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Start with `true` so sidebar is collapsed by default on unknown screen size (SSR safe)
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const large = width >= 1440;

      setIsMobile(mobile);

      if (large) {
        // On large screens (>= 1024px): sidebar should be OPEN (not collapsed)
        setIsCollapsed(false);
      } else if (mobile) {
        // On mobile (< 768px): sidebar should be collapsed/hidden
        setIsCollapsed(true);
      }
      // Between 768–1023px: keep current state (don't force either way)
    };

    // Run immediately on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DashboardContext.Provider value={{ isCollapsed, toggleCollapse, isMobile }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => React.useContext(DashboardContext);