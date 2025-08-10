export type BulletItem = {
  id: string;
  order: number;
  emoji: string;
  text: string;
  category?: string | null;
};

export type BulletEntry = {
  id: string;
  user_id: string;
  week_start_date: string; // YYYY-MM-DD
  created_at: string;
  items?: BulletItem[];
};
