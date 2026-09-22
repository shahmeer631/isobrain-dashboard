export type VideoStatus = "Published" | "Draft";

export interface Video {
  id: string;
  title: string;
  category: string;
  status: VideoStatus;
  duration: string;
  views: string;
  description: string;
  thumbnail?: string;
  uploadedAt: string;
}
