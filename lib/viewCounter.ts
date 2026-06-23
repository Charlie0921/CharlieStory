import { supabase } from "@/lib/supabase/client";
// 또는 네 프로젝트에 맞는 실제 supabase client 경로

export type ViewCounts = {
  today: number;
  total: number;
};

function getVisitorId() {
  if (typeof window === "undefined") return null;

  let visitorId = localStorage.getItem("visitor_id");

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitor_id", visitorId);
  }

  return visitorId;
}

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function trackPageView(page = "home") {
  console.log("[ViewCounter] trackPageView called");

  const visitorId = getVisitorId();
  console.log("[ViewCounter] visitorId:", visitorId);

  if (!visitorId) return;

  const todayKey = `viewed_${page}_${getTodayKey()}`;
  console.log("[ViewCounter] todayKey:", todayKey);

  if (localStorage.getItem(todayKey)) {
    console.log("[ViewCounter] already viewed today");
    return;
  }

  const { error } = await supabase.from("page_views").insert({
    visitor_id: visitorId,
    page,
  });

  console.log("[ViewCounter] insert error:", error);

  if (error) return;

  localStorage.setItem(todayKey, "true");
}

export async function getViewCounts(page = "home"): Promise<ViewCounts> {
  console.log("[ViewCounter] getViewCounts called");

  const { data, error } = await supabase.rpc("get_page_view_counts", {
    target_page: page,
  });

  console.log("[ViewCounter] rpc data:", data);
  console.log("[ViewCounter] rpc error:", error);

  if (error) {
    return { today: 0, total: 0 };
  }

  const row = data?.[0];

  return {
    today: Number(row?.today_count ?? 0),
    total: Number(row?.total_count ?? 0),
  };
}
