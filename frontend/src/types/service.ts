export interface ServiceItemData {
  id: number | string;
  title: string;
  description: string;
  features: string[];
  button_label: string;
  button_link: string;
  icon_key: string | null;
  sort_order: number;
  is_active: boolean;
  has_image: boolean;
  image_url: string | null;
  image_updated_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  count?: number;
  data: T;
  meta?: {
    total_count: number;
    active_count: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
