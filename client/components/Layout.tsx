import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, Sun, Moon, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Announcement } from "@/components/ui/announcement";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Announcements data
  const announcements = [
    {
      id: "1",
      text: "🌱 New sustainable collection just launched!",
      link: "/",
      linkText: "Shop Now"
    },
    {
      id: "2",
      text: "🔥 Get 20% off your first AI-generated outfit",
      link: "/",
      linkText: "Try Now"
    },
    {
      id: "3",
      text: "♻️ Join our thrift swap community event this weekend",
      link: "/",
      linkText: "Learn More"
    }
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { 
      label: "AI Services", 
      path: "#", 
      children: [
        { label: "AI Dashboard", path: "/ai-services" },
        { label: "Virtual Closet", path: "/closet" },
        { label: "Outfit Generator", path: "/outfit-generator" },
        { label: "Climate Assistant", path: "/ai-climate-assistant" },
        { label: "Virtual Stylist", path: "/eco-stylist" },
        { label: "AR Try-On", path: "/ar-fit" }
      ]
    },
    { 
      label: "Community", 
      path: "#", 
      children: [
        { label: "Green Action Hub", path: "/green-action-hub" },
        { label: "Style Circles", path: "/style-circles" },
        { label: "Swap Events", path: "/swap-events" },
        { label: "Community Hub", path: "/community" }
      ]
    },
    { 
      label: "Eco Store", 
      path: "#", 
      children: [
        { label: "Eco Marketplace", path: "/eco-marketplace" },
        { label: "Impact Tracker", path: "/impact-tracker" },
        { label: "Eco Store", path: "/eco-store" },
        { label: "Fabric Care", path: "/fabric-care" }
      ]
    },
    { label: "Sustainability", path: "/sustainability" },
    { label: "News", path: "/sustainability-feed" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Check if custom cursor is working
  useEffect(() => {
    // Add a small delay to ensure cursor is loaded
    const timer = setTimeout(() => {
      const cursorDot = document.querySelector('.cursor-dot');
      if (!cursorDot) {
        // Add class to show fallback cursor
        document.body.classList.add('no-custom-cursor');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Announcement Bar */}
      <Announcement announcements={announcements} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <nav className="container flex h-16 max-w-7xl items-center justify-between px-4 md:px-6" aria-label="Main navigation">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Home"
            title="EcoWardrobe AI Home"
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="hidden sm:inline-block font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              EcoWardrobe AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => 
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      {item.label} <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.path} asChild>
                        <Link 
                          to={child.path}
                          className="w-full px-2 py-1.5 cursor-pointer"
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  title={item.label}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Auth & Theme Buttons */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              title="Open menu"
              className="rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg">EcoWardrobe AI</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                title="Close menu"
                className="rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div className="space-y-2">
                      <div className="font-medium text-foreground py-2">{item.label}</div>
                      <div className="pl-4 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors",
                              isActive(child.path) && "bg-primary/10 text-primary"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors",
                        isActive(item.path) && "bg-primary/10 text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-4 rounded-md text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-4 rounded-md bg-primary text-primary-foreground text-center hover:bg-primary/90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container max-w-7xl px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg">EcoWardrobe AI</span>
              </div>
              <p className="text-sm text-foreground/70 mb-4">
                Empowering sustainable fashion through AI-driven solutions and community engagement.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">AI Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/ai-services" className="text-foreground/70 hover:text-foreground transition-colors">AI Dashboard</Link></li>
                <li><Link to="/outfit-generator" className="text-foreground/70 hover:text-foreground transition-colors">Outfit Generator</Link></li>
                <li><Link to="/ai-climate-assistant" className="text-foreground/70 hover:text-foreground transition-colors">Climate Assistant</Link></li>
                <li><Link to="/eco-stylist" className="text-foreground/70 hover:text-foreground transition-colors">Virtual Stylist</Link></li>
                <li><Link to="/ar-fit" className="text-foreground/70 hover:text-foreground transition-colors">AR Try-On</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/green-action-hub" className="text-foreground/70 hover:text-foreground transition-colors">Green Action Hub</Link></li>
                <li><Link to="/style-circles" className="text-foreground/70 hover:text-foreground transition-colors">Style Circles</Link></li>
                <li><Link to="/swap-events" className="text-foreground/70 hover:text-foreground transition-colors">Swap Events</Link></li>
                <li><Link to="/community" className="text-foreground/70 hover:text-foreground transition-colors">Community Hub</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Eco Store</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/eco-marketplace" className="text-foreground/70 hover:text-foreground transition-colors">Eco Marketplace</Link></li>
                <li><Link to="/impact-tracker" className="text-foreground/70 hover:text-foreground transition-colors">Impact Tracker</Link></li>
                <li><Link to="/eco-store" className="text-foreground/70 hover:text-foreground transition-colors">Eco Store</Link></li>
                <li><Link to="/fabric-care" className="text-foreground/70 hover:text-foreground transition-colors">Fabric Care</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-foreground/70">
            <p>© 2024 EcoWardrobe AI. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}