
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
    // Match HTML redesign breakpoint: sidebar hidden ≤980px
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 981;

      setIsMobile(mobile);

      if (width >= 981) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };

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