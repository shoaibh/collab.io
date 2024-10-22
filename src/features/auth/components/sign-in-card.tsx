import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { generateGibberishEmail, generatePassword } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SignInCard = ({ setState }: { setState: (state: SignInFlow) => void }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    signIn("password", { name, email: generateGibberishEmail(), password: generatePassword(), flow: "signUp" })
      .catch((e) => {
        console.log(e);
        setError("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { signIn } = useAuthActions();

  const handleSignIn = (value: "github" | "google") => {
    signIn(value);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to Continue </CardTitle>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button disabled={isLoading} onClick={() => handleSignIn("google")} variant="outline" size="lg" className="w-full relative">
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" /> Continue with Google
          </Button>
          <Button disabled={isLoading} onClick={() => handleSignIn("github")} variant="outline" size="lg" className="w-full relative">
            <FaGithub className="size-5 absolute top-2.5 left-2.5" /> Continue with Github
          </Button>
        </div>
        <Separator />

        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input disabled={isLoading} onChange={(e) => setName(e.target.value)} type="text" value={name} placeholder="Your Name" required />
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            Continue as a Guest
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
