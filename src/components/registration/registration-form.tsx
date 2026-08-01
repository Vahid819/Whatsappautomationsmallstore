"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerSchema,
  CustomerInput,
} from "@/schemas/customer.schema";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RegistrationFormProps {
  token: string;
  phone: string;
}

export default function RegistrationForm({
  token,
  phone,
}: RegistrationFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerInput) => {
    try {
      console.log("🔥 onSubmit called");
      console.log("Token:", token);
      console.log("Data:", data);

      setLoading(true);

      const response = await axios.post("/api/register", {
        token,
        phone,
        ...data,
      });

      toast.success(response.data.message);

      router.push("/success");
    } catch (error: any) {
      console.error("Registration Error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Registration failed"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-3xl">
            Customer Registration
          </CardTitle>

          <CardDescription>
            Complete your profile before placing your
            first order.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Phone Number</Label>

              <Input
                value={phone}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>

              <Input
                {...register("name")}
                placeholder="Enter your full name"
              />

              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Address</Label>

              <Textarea
                rows={4}
                {...register("address")}
                placeholder="Enter delivery address"
              />

              {errors.address && (
                <p className="text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Landmark</Label>

              <Input
                {...register("landmark")}
                placeholder="Nearby landmark"
              />
            </div>

            <div className="space-y-2">
              <Label>Delivery Instructions</Label>

              <Textarea
                rows={3}
                {...register("instructions")}
                placeholder="Optional"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Registering..."
                : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}