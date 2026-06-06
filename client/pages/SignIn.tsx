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
      // Import auth service dynamically to avoid SSR issues
      const { login } = await import('../services/auth');
      
      // Call login API
      const response = await login(formData.email, formData.password);
      
      // Store auth data properly
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userName', response.user.name);
      
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would integrate with social auth providers
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('user', JSON.stringify({ 
        user: { name: 'Social User', email: 'social@example.com' },
        token: 'social-auth-token'
      }));
      toast.success(`Signed in with ${provider} successfully!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(`${provider} login failed`);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/signin");
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
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-foreground/70">
              Sign in to your sustainable fashion account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    placeholder="you@example.com"
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-12 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-foreground/70"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 flex items-center justify-center transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
              >
                {loading ? (
                  <span className="animate-pulse">Signing in...</span>
                ) : (
                  "Sign in"
                )}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full h-11 px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 hover:translate-y-[-2px]"
              >
                Continue as Demo User
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm">
            <span className="text-foreground/70">Don't have an account?</span>{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button 
              onClick={() => handleSocialLogin('Facebook')}
              disabled={loading}
              aria-label="Sign in with Facebook"
              title="Sign in with Facebook"
              className="w-10 h-10 rounded-full bg-[#4267B2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('Twitter')}
              disabled={loading}
              aria-label="Sign in with Twitter"
              title="Sign in with Twitter"
              className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              aria-label="Sign in with Google"
              title="Sign in with Google"
              className="w-10 h-10 rounded-full bg-[#DB4437] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
              </svg>
            </button>
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