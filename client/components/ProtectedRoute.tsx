import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: checking auth status', { isAuthenticated, loading });
    
    if (!loading && !isAuthenticated) {
      console.log('ProtectedRoute: not authenticated, redirecting to signin');
      navigate("/signin");
    } else if (!loading) {
      console.log('ProtectedRoute: user is authenticated, allowing access');
      setHasChecked(true);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    console.log('ProtectedRoute: still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Additional safety check - shouldn't reach here but just in case
    console.log('ProtectedRoute: final auth check failed, not rendering children');
    return null;
  }

  console.log('ProtectedRoute: rendering protected content');
  return <>{children}</>;
}