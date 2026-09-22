export interface IUserDashboardStats {
  enrolledCourses: number;
  certificatesEarned: number;
  avgProgress: number;
  totalLearningTime: string;
}

export interface IContinueLearningCourse {
  courseId: string;
  title: string;
  thumbnail: string;
  progress?: number; // Optional if available later
}

export interface IRecentResource {
  id: string;
  title: string;
  type: string;
  size: string;
  url?: string;
}

export interface IRecentAchievement {
  id: string;
  title: string;
  date: string;
}

export interface IUserDashboardData {
  stats: IUserDashboardStats;
  continueLearning: IContinueLearningCourse[];
  recentResources: IRecentResource[];
  recentAchievements: IRecentAchievement[];
}

export interface IUserDashboardResponse {
  success: boolean;
  message: string;
  data: IUserDashboardData;
}

export interface IMyCourse {
  courseId: string;
  title: string;
  thumbnail: string;
  instructor?: string;
  category?: string;
  progress?: number;
  lessonsDone?: number;
  totalLessons?: number;
  totalTime?: string;
  status?: string;
}

export interface IMyCourseStats {
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  totalHours: string;
}

export interface IMyCoursesData {
  stats: IMyCourseStats;
  courses: IMyCourse[];
}

export interface IMyCoursesResponse {
  success: boolean;
  message: string;
  data: IMyCoursesData;
}

export interface IProgressStats {
  avgProgress: number;
  activeCourses: number;
  completedCourses: number;
  totalTime: string;
}

export interface ICourseProgress {
  courseId: string;
  title: string;
  progress: number;
  grade: string;
  totalLessons: number;
  completedLessons: number;
  totalTime: string;
  lastActivity: string;
  deadline: string;
}

export interface IProgressData {
  stats: IProgressStats;
  weeklyActivity: number[];
  courseProgress: ICourseProgress[];
}

export interface IUserProgressResponse {
  success: boolean;
  message: string;
  data: IProgressData;
}

export interface ICertificate {
  id: string;
  courseName: string;
  instructor: string;
  issuedAt: string;
  template: string;
  verified: boolean;
  courseId?: string;
  studentName?: string;
}

export interface ICertificateStats {
  totalCertificates: number;
  thisMonth: number;
  profileViews: number;
}

export interface ICertificatesData {
  stats: ICertificateStats;
  certificates: ICertificate[];
}

export interface IUserCertificatesResponse {
  success: boolean;
  message: string;
  data: ICertificatesData;
}

export interface ISingleCertificateData {
  id: string;
  userId: string;
  courseId: string;
  templateId: string;
  downloadCount: number;
  issuedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    instructor: string;
    description: string;
    thumbnail: string;
    categoryId: string;
    cpdHours: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    certificateTemplateId: string;
  };
  template: {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    bodyText: string;
    templateType: string;
    signature1: string;
    signature2: string;
    footerText: string;
    isActive: boolean;
    autoIssue: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ISingleCertificateResponse {
  success: boolean;
  message: string;
  data: ISingleCertificateData;
}

