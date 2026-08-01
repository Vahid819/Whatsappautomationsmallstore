import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;

export default function SuccessPage() {
  const whatsappUrl = `https://wa.me/${BUSINESS_PHONE}?text=MENU`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-lg">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />

        <h1 className="mt-6 text-3xl font-bold">
          Registration Successful 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Your registration has been completed successfully.
        </p>

        <p className="mt-2 text-gray-600">
          Click the button below to continue your order on WhatsApp.
        </p>

        <Link
          href={whatsappUrl}
          target="_blank"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
        >
          Continue on WhatsApp
        </Link>
      </div>
    </main>
  );
}