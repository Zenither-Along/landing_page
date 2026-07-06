export interface LookbookImage {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_visible: boolean;
  display_order: number;
  file_size_bytes: number | null;
  created_at: string;
}
