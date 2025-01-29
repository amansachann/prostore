"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SignUp = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant={"default"} disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              required={true}
              autoComplete="name"
              placeholder="John Doe"
              defaultValue={signUpDefaultValues.name}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              required={true}
              autoComplete="email"
              placeholder="email@example.com"
              defaultValue={signUpDefaultValues.email}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              required={true}
              autoComplete="password"
              placeholder="**********"
              defaultValue={signUpDefaultValues.password}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required={true}
              autoComplete="confirmPassword"
              placeholder="**********"
              defaultValue={signUpDefaultValues.confirmPassword}
            />
          </div>
          {data && !data.success && (
            <div className="text-destructive text-center text-sm font-medium">
              {data.message}
            </div>
          )}
          <div>
            <SignUpButton />
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="link" target="_self">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
