"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapButtonProps {
  address: string;
}

export function MapButton({
  address,
}: MapButtonProps) {
  function openMap() {
    const destination = encodeURIComponent(address);

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={openMap}
    >
      <MapPin className="mr-2 h-4 w-4" />
      Map
    </Button>
  );
}