
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  LineChart,
  Bot,
  Newspaper,
  BookOpen,
  Search,
  History,
  Info,
  LogOut,
  Settings,
  LifeBuoy,
  Landmark
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/backtesting", label: "Backtesting", icon: LineChart },
    { href: "/paper-trading", label: "Paper Trading", icon: BookOpen },
    { href: "/transactions", label: "Transactions", icon: Landmark },
    { href: "/sentiment", label: "Sentiment", icon: Newspaper },
    { href: "/ai-signals", label: "AI Signals", icon: Bot },
    { href: "/historical-data", label: "Historical Data", icon: History },
    { href: "/about", label: "About Us", icon: Info },
];

function AppSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const getInitials = (firstName?: string, email?: string) => {
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  }

  return (
    <Sidebar>
      <SidebarHeader>
         <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">FinSim</span>
          </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 p-2"
              >
                 <Avatar>
                    <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/36`} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(user?.firstName, user?.email ?? undefined)}</AvatarFallback>
                </Avatar>
                <div className="text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.firstName || user?.email}</p>
                    <p className="text-xs text-muted-foreground">User</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

   const getInitials = (firstName?: string, email?: string) => {
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
       toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

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
        <div className="hidden md:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                  <Avatar>
                      <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/36`} data-ai-hint="user avatar" />
                      <AvatarFallback>{getInitials(user?.firstName, user?.email ?? undefined)}</AvatarFallback>
                  </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.firstName || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   Logout
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
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
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Or a redirect component, but AuthProvider handles it
  }
  
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
