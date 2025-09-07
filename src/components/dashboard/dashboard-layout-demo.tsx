
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Home,
  LineChart,
  Bot,
  Newspaper,
  BookOpen,
  Search,
  History,
  Info,
  LogIn,
  Landmark
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

const navItems = [
    { href: "#", label: "Dashboard", icon: Home },
    { href: "#", label: "Backtesting", icon: LineChart },
    { href: "#", label: "Paper Trading", icon: BookOpen },
    { href: "#", label: "Transactions", icon: Landmark },
    { href: "#", label: "Sentiment", icon: Newspaper },
    { href: "#", label: "AI Signals", icon: Bot },
    { href: "#", label: "Historical Data", icon: History },
    { href: "/about", label: "About Us", icon: Info },
];

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
         <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">FinSim</span>
          </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                        <Link href={item.href}>
                             <item.icon />
                             <span>{item.label}</span>
                        </Link>
                     </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button asChild>
            <Link href="/signup">
                <LogIn className="mr-2" />
                Sign Up to Start
            </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <SidebarTrigger className="md:hidden"/>
         <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search stocks..."
            className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px]"
            />
        </div>
        <ThemeToggle />
        <Button asChild variant="outline">
            <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
            <Link href="/signup">Sign Up</Link>
        </Button>
    </header>
  );
}

function Footer() {
    return (
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinSim. All rights reserved.
        </footer>
    )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
     <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col min-h-screen">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
            {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
