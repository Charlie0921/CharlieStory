// /pages/Project/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// anon key는 클라이언트에서 쓰라고 만든 공개 키라 노출되어도 괜찮습니다.
// 절대 service_role 키를 넣지 마세요.
export const supabase = createClient(
  "https://iwhyfeosfcjdgabsvccs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aHlmZW9zZmNqZGdhYnN2Y2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjE3ODUsImV4cCI6MjA3MDQ5Nzc4NX0.vNtgwd2LqdZx0k5jvC8T31hJY_zwsf_q1tFoeRoskdw"
);
