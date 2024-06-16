import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://earndaxgtiiituwjnnhj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcm5kYXhndGlpaXR1d2pubmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMTI4NDksImV4cCI6MjAzMzg4ODg0OX0.HSqzWPVILIDLOl0wkXd6-6ABMrC-qiop03-UBulD8ns",
{
    auth: {
        storage: localStorage,
  },
});
