import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../Context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../services/authService";
import Logo from "@/assets/bookshelf2.svg?react";

const Auth = () => {
  const navigate = useNavigate();
  const {user,login,register,googleAuth} = useAuth();

  const [tab, setTab] = useState("login");
  const [isLoading,setIsLoading] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  },[user,navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (tab==='login'){
        await login(email,password);
        toast.success('Welcome Back');
      } else{
        await register(name,email,password);
        toast.success('Account created successfully');
      }
      navigate('/');
    }
    catch(error) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (crendentialResponse) => {
    try {
      await googleAuth(crendentialResponse.credential);
      toast.success('Logged in with Google!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication falied!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-pink opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-purple opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-card p-8 md:p-10">
        <div className="flex items-center gap-2 mb-8">
            <Logo className="w-7 h-7 sm:w-8 sm:h-8 dark:invert transition-all" />
          <span className="font-serif italic text-3xl sm:text-4xl font-bold tracking-tight leading-none">
              Buqs
            </span>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v )} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full">
            <TabsTrigger value="login" className="rounded-full">Sign in</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <h1 className="text-2xl font-extrabold mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground mb-6">Sign in to continue your reading journey.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field 
              id="login-email"
              name='email' 
              label="Email" 
              icon={Mail} 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              disabled={isLoading}
              />
              <Field 
              id="login-pw"
              name='password'
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              disabled={isLoading} />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full rounded-full" size="lg" >{ isLoading ? 'Signing in....':'Sign in'}</Button>
            </form>

            <Divider />


          <div className="flex justify-center w-full">
            <GoogleLogin
            onSuccess={handleGoogle}
            onError={()=>toast.error('Google popup failed or closed')}
            theme="outline"
            shape="pill"
            width='320'
            text="continue_with"
            />
          </div>
          </TabsContent>

          <TabsContent value="register">
            <h1 className="text-2xl font-extrabold mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground mb-6">Start building your personal library today.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field 
              id="reg-name"
              name='name'  
              label="Full name" 
              icon={User}  
              type="text"     
              placeholder="Jane Doe" 
              value={name}
              onChange={(e)=>setName(e.target.value)}
              disabled={isLoading}
              />
              <Field 
              id="reg-email"
              name='email' 
              label="Email"     
              icon={Mail}  
              type="email"    
              placeholder="you@example.com" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              disabled={isLoading}
              />
              <Field 
              id="reg-pw"
              name='password'   
              label="Password"  
              icon={Lock}  
              type="password" 
              placeholder="At least 8 characters" 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}className="w-full rounded-full" size="lg">{isLoading ? 'Creating Account':'Create Account'}</Button>
            </form>

            <Divider />

            <div className="flex justify-center w-full">
              <GoogleLogin 
              onSuccess={handleGoogle}
              onError={()=>toast.error('Google popup closed or failed')}
              theme="outline"
              size="large"
              shape="pill"
              width="320"
              text="continue_with"
              />
            </div>

          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


const Field = ({
  id, label, icon: Icon, type, placeholder, value, onChange, disabled
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input id={id} type={type} placeholder={placeholder} required
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="pl-9 rounded-full" />
    </div>
  </div>
);

const Divider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px bg-border flex-1" />
    <span className="text-xs text-muted-foreground">OR</span>
    <div className="h-px bg-border flex-1" />
  </div>
);


export default Auth;
