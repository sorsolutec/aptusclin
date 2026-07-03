export interface Exam {
  id: string;
  title: string;
  description?: string;
  start_at: string; // ISO 8601
  end_at: string; // ISO 8601
  location?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}
