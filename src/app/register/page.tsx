import { verifyRegistrationToken } from "@/services/registration-token.service";

import RegistrationForm from "@/components/registration/registration-form";

interface RegisterPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { token } = await searchParams;

  // Token missing
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Registration Link
          </h1>

          <p className="mt-2 text-muted-foreground">
            Registration token is missing.
          </p>
        </div>
      </div>
    );
  }

  // Verify token
  const registration = await verifyRegistrationToken(token);

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Link Expired
          </h1>

          <p className="mt-2 text-muted-foreground">
            This registration link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl py-16">
      <RegistrationForm
        token={token}
        phone={registration.phone}
      />
    </div>
  );
}