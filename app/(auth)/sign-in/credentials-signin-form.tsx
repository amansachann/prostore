"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant={"default"} disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              required={true}
              autoComplete="email"
              placeholder="email@example.com"
              defaultValue={signInDefaultValues.email}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              required={true}
              autoComplete="password"
              placeholder="**********"
              defaultValue={signInDefaultValues.password}
            />
          </div>
          {data && !data.success && (
            <div className="text-destructive text-center text-sm font-medium">
              {data.message}
            </div>
          )}
          <div>
            <SignInButton />
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href={"/sign-up"} className="link" target="_self">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default CredentialsSignInForm;
