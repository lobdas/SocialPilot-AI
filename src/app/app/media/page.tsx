"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MediaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/content-studio");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-slate-400 text-xs">
      Redirecting to AI Content Studio...
    </div>
  );
}
