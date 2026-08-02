import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );

    case "ACCEPTED":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Accepted
        </Badge>
      );

    case "PREPARING":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Preparing
        </Badge>
      );

    case "PACKED":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Packed
        </Badge>
      );

    case "OUT_FOR_DELIVERY":
      return (
        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
          Out for Delivery
        </Badge>
      );

    case "DELIVERED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Delivered
        </Badge>
      );

    case "CANCELLED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Cancelled
        </Badge>
      );

    default:
      return <Badge>{status}</Badge>;
  }
}