export interface Event {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  start_at: string; // ISO 8601
  end_at: string;   // ISO 8601
  location?: string;
  created_at?: string;
  updated_at?: string;
}
