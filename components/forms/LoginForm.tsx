"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { loginUser } from "@/lib/actions/patient.actions";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

// Login validation schema
const LoginFormValidation = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginFormValidation>) => {
    setIsLoading(true);
    setError("");

    try {
      const user = await loginUser(values);

      if (user) {
        // Store user info in localStorage for session management
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push(`/patients/${user.$id}/dashboard`);
      } else {
        setError("Invalid credentials. Please check your email and phone number.");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during login. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome Back 👋</h1>
          <p className="text-dark-700">Sign in to access your appointments.</p>
        </section>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>

        <div className="text-center">
          <p className="text-14-regular text-dark-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-green-500 hover:text-green-600 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </Form>
  );
}; 