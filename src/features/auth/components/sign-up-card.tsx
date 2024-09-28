import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInFlow } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

export const SignUpCard = ({ setState }: { setState: (state: SignInFlow) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to Continue </CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input disabled={false} onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email" required />
          <Input
            disabled={false}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            placeholder="Password"
            required
          />
          <Input
            disabled={false}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button disabled={false} onClick={() => {}} variant="outline" size="lg" className="w-full relative">
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" /> Continue with Google
          </Button>
          <Button disabled={false} onClick={() => {}} variant="outline" size="lg" className="w-full relative">
            <FaGithub className="size-5 absolute top-2.5 left-2.5" /> Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already Have an account?{" "}
          <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
