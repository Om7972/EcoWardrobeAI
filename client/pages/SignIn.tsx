import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Leaf, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `user-${Date.now()}`,
          email: formData.email,
          name: formData.email.split("@")[0],
          profile: {
            stylePreferences: [],
          },
        }),
      });

      if (!response.ok) throw new Error("Sign in failed");

      const data = await response.json();
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("userName", data.data.name);

      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUserId = "demo-user-123";
    const demoName = "Demo User";
    localStorage.setItem("userId", demoUserId);
    localStorage.setItem("userName", demoName);
    toast.success("Logged in as Demo User");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">EcoStyle</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-foreground/70">
              Sign in to your sustainable fashion account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-foreground/50 hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-foreground/50">Or continue as</span>
            </div>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 border border-border/50 text-foreground rounded-lg font-semibold hover:bg-muted/50 transition-all"
            disabled={loading}
          >
            Demo User
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-foreground/70">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold">
                Create one
              </Link>
            </p>
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
