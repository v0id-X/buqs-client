import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuth } from "../Context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  const {resetPassword} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(resetToken,password);
      toast.success("Password updated! Please sign in!");
      navigate('/auth');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired link. Please try again');
    } finally{
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-pink opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-purple opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-card p-8 md:p-10">
        <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="flex items-center gap-2 mb-8">
            <Logo className="w-7 h-7 sm:w-8 sm:h-8 dark:invert transition-all" />
          <span className="font-serif italic text-3xl sm:text-4xl font-bold tracking-tight leading-none">
              Buqs
            </span>
        </div>

        <h1 className="text-2xl font-extrabold mb-1">Set a new password</h1>
        <p className="text-sm text-muted-foreground mb-2">Choose a strong password you haven't used before.</p>
     
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rp-pw">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="rp-pw"
                name='newPassword'
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 rounded-full"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rp-confirm">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="rp-confirm"
                type="password"
                required
                placeholder="Repeat your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-9 rounded-full"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" size="lg">{isLoading ? "Updating....":"Update password"}</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
