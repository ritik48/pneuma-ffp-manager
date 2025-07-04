"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must contain at least 3 character"),
});

export default function Signup() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }
      toast.success("Account created successfull");

      await signIn("credentials", {
        ...values,
        callbackUrl: "/",
      });
    } catch (error) {}
  };
  return (
    <section className="flex-1 flex flex-col">
      <div className="container flex-grow">
        <div className="mx-auto sm:w-96 w-[98%] bg-slate-100 rounded-xl p-8 gap-4 flex flex-col sm:mt-40 mt-20">
          <div className="text-center">
            <h2 className="text-xl font-bold">Create an account</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="w-full flex flex-col gap-2">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? "Creating..." : "Signup"}
                </Button>
                <Link
                  href={"/signin"}
                  className="text-left text-sm hover:underline mt-1"
                >
                  Already have an account ?
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
