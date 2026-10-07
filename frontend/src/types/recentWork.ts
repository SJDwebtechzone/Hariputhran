export interface RecentWorkItem {
  id: number;
  position: number;
  title: string;
  location: string;
  isActive?: boolean;
  hasImage: boolean;
  imageUrl: string | null;
  updatedAt?: string | null;
  imageUpdatedAt?: string | null;
}

export interface RecentWorksResponse {
  success: boolean;
  count: number;
  sectionActive?: boolean;
  data: RecentWorkItem[];
  message?: string;
}

export interface SectionActiveResponse {
  success: boolean;
  message?: string;
  sectionActive: boolean;
}

export interface RecentWorkSingleResponse {
  success: boolean;
  message?: string;
  data: RecentWorkItem;
}

export interface UpdateRecentWorkPayload {
  title: string;
  location: string;
  image?: File | null;
  removeImage?: boolean;
}
