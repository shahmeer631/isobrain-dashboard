import { ICategory } from "./courseTypes";

export type VideoStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface IQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  answer: string;
}

export interface IQuiz {
  id: string;
  lessonId: string;
  questions: IQuestion[];
}

export interface ILesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
  courseId: string;
  videoId: string;
  chapterId: string | null;
  createdAt: string;
  quizzes?: IQuiz[];
}

export interface IVideo {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  videoUrl: string;
  thumbnail: string | null;
  duration: string;
  status: VideoStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  category?: ICategory | null;
  lessons?: ILesson[];
}

export interface IVideoResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IVideo[];
}

export interface ICreateVideoResponse {
  success: boolean;
  message: string;
  data: {
    video: IVideo;
    lesson: ILesson;
  };
}
