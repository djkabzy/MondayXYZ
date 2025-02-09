"use client";

import { Toaster } from "sonner";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1f2937",
          border: "1px solid rgba(242, 169, 0, 0.2)",
          color: "white",
        },
        className: "glass-effect",
        duration: 3000,
      }}
    />
  );
}
