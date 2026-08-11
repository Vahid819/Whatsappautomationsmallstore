"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateOrderStatusAction } from "@/actions/order.actions";

import { Button } from "@/components/ui/button";

interface DoneOrderButtonProps {
  orderId: string;
}

export function DoneOrderButton({
  orderId,
}: DoneOrderButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  function handleDone() {
    startTransition(async () => {
      const result =
        await updateOrderStatusAction(
          orderId,
          "DELIVERED"
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        "Order marked as delivered."
      );
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleDone}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          Done
        </>
      )}
    </Button>
  );
}