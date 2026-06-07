import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuth } from "../Context/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {forgotPassword} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email) return toast.error("Please enter your email");

    setIsLoading(true);
   
    try{
      const res = await forgotPassword(email);
      console.log(`email res: `,res)
      if(res.success){
        setSent(true);
        toast.success("Reset link sent! Check your inbox.");
      }
      
    } catch(error){
      toast.error(error.response?.data?.message || "Failed to send email. Please try again.")
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

        <h1 className="text-2xl font-extrabold mb-1">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {sent
          ?"Check Your inbox. We've sent you a secure reset link."
          :"Enter your email and we'll send you a link to reset it."}
        </p>

        {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fp-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="fp-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 rounded-full"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-full" size="lg" disabled={isLoading}>
            {isLoading ? "Sending....":"Send reset link"}
          </Button>
        </form>
        ) : (
          <div className="text-center mt-6 space-y-4">
            <Button variant='outline' className='w-full rounded-full' onClick={()=>setSent(false)}>
              Try another email?
            </Button>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Remembered it? <Link to="/auth" className="underline hover:text-foreground">Sign in</Link>
        </p> 
        </div>
      )}
      </div>
    </div>
  );
};

export default ForgotPassword;
