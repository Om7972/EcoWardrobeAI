import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, Sun, Moon, User, ChevronDown, Search, Bell } from "lucide-react";
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

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(segment => segment);
    
    if (pathSegments.length === 0) return [];
    
    return pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: index === pathSegments.length - 1 ? undefined : href
      };
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Virtual Closet", path: "/closet" },
    { 
      label: "AI Services", 
      path: "#", 
      children: [
        { label: "AI Outfit Generator", path: "/outfit-generator" },
        { label: "Climate Assistant", path: "/ai-climate-assistant" },
        { label: "Virtual Stylist", path: "/eco-stylist" },
        { label: "AR Try-On", path: "/ar-fit" },
        { label: "AI Dashboard", path: "/ai-services" }
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

          {/* Search Bar */}
          <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input 
                type="text" 
                placeholder="Search..." 
                aria-label="Search"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          </div>

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
                              "block py-2 px-3 rounded-md text-sm",
                              isActive(child.path)
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
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
                        "block py-2 px-3 rounded-md text-sm font-medium",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <Separator className="my-4" />
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  >
                    Profile
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumbs */}
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4">
        <Breadcrumbs items={generateBreadcrumbs()} />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg">EcoWardrobe AI</span>
              </Link>
              <p className="text-sm text-foreground/70">
                Empowering sustainable fashion through AI innovation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">AI Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/ai-climate-assistant" className="text-foreground/70 hover:text-foreground">Climate Assistant</Link></li>
                <li><Link to="/outfit-generator" className="text-foreground/70 hover:text-foreground">Outfit Generator</Link></li>
                <li><Link to="/eco-stylist" className="text-foreground/70 hover:text-foreground">Virtual Stylist</Link></li>
                <li><Link to="/ar-fit" className="text-foreground/70 hover:text-foreground">AR Try-On</Link></li>
                <li><Link to="/ai-services" className="text-foreground/70 hover:text-foreground">AI Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/community" className="text-foreground/70 hover:text-foreground">Community Hub</Link></li>
                <li><Link to="/green-action-hub" className="text-foreground/70 hover:text-foreground">Green Actions</Link></li>
                <li><Link to="/style-circles" className="text-foreground/70 hover:text-foreground">Style Circles</Link></li>
                <li><Link to="/swap-events" className="text-foreground/70 hover:text-foreground">Swap Events</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Eco Store</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/eco-store" className="text-foreground/70 hover:text-foreground">Eco Store</Link></li>
                <li><Link to="/eco-marketplace" className="text-foreground/70 hover:text-foreground">Marketplace</Link></li>
                <li><Link to="/impact-tracker" className="text-foreground/70 hover:text-foreground">Impact Tracker</Link></li>
                <li><Link to="/fabric-care" className="text-foreground/70 hover:text-foreground">Fabric Care</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Sustainability</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/sustainability" className="text-foreground/70 hover:text-foreground">Sustainability Hub</Link></li>
                <li><Link to="/sustainability-feed" className="text-foreground/70 hover:text-foreground">News & Trends</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-foreground/70">
            <p>© {new Date().getFullYear()} EcoWardrobe AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}