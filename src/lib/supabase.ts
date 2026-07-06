import { createBrowserClient } from "@supabase/ssr";

// Using createBrowserClient from @supabase/ssr so the session is stored in
// cookies — making it readable by the server-side middleware auth guard.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper — get public URL for a storage path
export function getLookbookImageUrl(storagePath: string): string {
  return supabase.storage.from("lookbook").getPublicUrl(storagePath).data
    .publicUrl;
}
