export interface BulletItem {
  id?: number;
  bullet_entry_id?: number;
  order_index?: number;
  emoji: string;
  text: string;
  category?: string;
}

export interface BulletEntry {
  id?: number;
  user_id?: string;
  week_start_date: string;
  created_at?: string;
  items: BulletItem[];
}

export interface Streak {
  streak: number;
}

export interface Insight {
  insight: string;
}
