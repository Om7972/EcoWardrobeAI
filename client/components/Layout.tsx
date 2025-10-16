import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Virtual Closet", path: "/closet" },
    { label: "AI Outfit", path: "/outfit-generator" },
    { label: "Sustainability", path: "/sustainability" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link
            to="/"
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background animate-slide-up">
            <div className="container px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-muted/30 py-8 md:py-12">
        <div className="container max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-foreground">EcoWardrobe AI</span>
              </div>
              <p className="text-sm text-foreground/60">
                Transform your wardrobe sustainably with AI-powered outfit suggestions.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="text-foreground/60 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/closet" className="text-foreground/60 hover:text-primary transition-colors">
                    Virtual Closet
                  </Link>
                </li>
                <li>
                  <Link to="/outfit-generator" className="text-foreground/60 hover:text-primary transition-colors">
                    AI Outfit Generator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="text-foreground/60 hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-foreground/60 hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#careers" className="text-foreground/60 hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#privacy" className="text-foreground/60 hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-foreground/60 hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-foreground/60 hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
              <p>&copy; 2024 EcoWardrobe AI. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#twitter" className="hover:text-primary transition-colors">
                  Twitter
                </a>
                <a href="#linkedin" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
                <a href="#instagram" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
