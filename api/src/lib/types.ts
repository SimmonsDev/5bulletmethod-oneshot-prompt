export type EntryItemInput = {
  emoji: string;
  text: string;
  category?: string | null;
};

export type Entry = {
  id: number;
  user_id: string;
  week_start_date: string; // YYYY-MM-DD
  created_at: string;
  items: Array<{
    id: number;
    order: number;
    emoji: string;
    text: string;
    category: string | null;
  }>;
};
