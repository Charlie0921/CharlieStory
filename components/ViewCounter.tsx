"use client";

import { useEffect, useState } from "react";
import {
  getViewCounts,
  trackPageView,
  type ViewCounts,
} from "@/lib/viewCounter";

export default function ViewCounter() {
  const [counts, setCounts] = useState<ViewCounts>({ today: 0, total: 0 });

  useEffect(() => {
    let active = true;

    async function updateCounts() {
      await trackPageView("home");
      const nextCounts = await getViewCounts("home");

      if (active) setCounts(nextCounts);
    }

    void updateCounts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="visitor-counter" aria-label="Visitor count">
      <span>
        TODAY <b>{counts.today}</b>
      </span>
      <span>
        TOTAL <b>{counts.total}</b>
      </span>
    </div>
  );
}
