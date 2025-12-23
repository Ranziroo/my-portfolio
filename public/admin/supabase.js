import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://vakzffcyezcjfbvakfup.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZha3pmZmN5ZXpjamZidmFrZnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjQ2ODcsImV4cCI6MjA4MTY0MDY4N30.5y83PUz8SOszHd7knW0RIwiUT1KOT_PJ7Ik8rN0b4pQ"
);