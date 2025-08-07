export type BulletItem = {
  id: number;
  order: number;
  emoji: string;
  text: string;
  category: string | null;
};

export type Entry = {
  id: number;
  user_id: string;
  week_start_date: string;
  created_at: string;
  items: BulletItem[];
};
