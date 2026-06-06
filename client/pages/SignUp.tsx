import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Leaf, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      // Import auth service dynamically to avoid SSR issues
      const { register } = await import('../services/auth');
      
      // Call register API with default style preferences
      const defaultStyles = ["casual", "minimalist"];
      const response = await register(
        formData.name,
        formData.email,
        formData.password,
        defaultStyles
      );
      
      // Store user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("userName", response.user.name);
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 hover-float3d">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src="/EcoWardrobe_png.svg" alt="EcoWardrobe AI Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-bold text-foreground">EcoWardrobe AI</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg hover-tilt3d">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-foreground/70">
              Join the sustainable fashion movement today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              {loading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm">
            <span className="text-foreground/70">Already have an account?</span>{" "}
            <Link
              to="/signin"
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-foreground/50 mt-6">
          We protect your privacy. Read our Privacy Policy.
        </p>
      </div>
    </div>
  );
}