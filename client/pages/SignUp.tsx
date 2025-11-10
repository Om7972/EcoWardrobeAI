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
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/leaves-bg.jpg')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-black/60 backdrop-blur-md text-white shadow-xl border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-6">SignUp</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 rounded-md bg-transparent border border-white/20 focus:border-white/50 focus:outline-none"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-md bg-transparent border border-white/20 focus:border-white/50 focus:outline-none"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-md bg-transparent border border-white/20 focus:border-white/50 focus:outline-none"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-white/70">OR</p>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/signin" className="text-white/90 hover:text-white transition-colors">
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
}