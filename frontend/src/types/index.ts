// Core Ikigai Types
export interface IkigaiInput {
  interests: string[];
  skills: string[];
  values: string[];
  personalityType?: string;
  location?: string;
  goals?: string[];
}

export interface IkigaiAlignment {
  love: string;
  goodAt: string;
  worldNeeds: string;
  paidFor: string;
}

export interface RecommendedCareer {
  title: string;
  description: string;
  whyFit: string;
  ikigaiAlignment: IkigaiAlignment;
}

export interface SkillDevelopmentPlan {
  skill: string;
  type: 'technical' | 'soft';
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
}

export interface RecommendationOutput {
  personalizedSummary: string;
  recommendedCareers: RecommendedCareer[];
  skillDevelopmentPlan: SkillDevelopmentPlan[];
  roadmap90Days: RoadmapPhase[];
}

// User Profile Types
export interface WorkExperience {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  graduationDate: string;
}

export interface JobPreferences {
  jobTitles?: string[];
  workModels?: ('Remote' | 'Hybrid' | 'On-site')[];
  targetIndustries?: string[];
}

export interface UserLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface UserProfile {
  fullName?: string;
  headline?: string;
  location?: string;
  summary?: string;
  profilePictureUrl?: string;
  resumePath?: string;
  skills?: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  careerGoals?: string;
  jobPreferences?: JobPreferences;
  links?: UserLinks;
}

// Job Search Types
export interface JobDetails {
  title: string;
  company: string;
  location?: string;
  description: string;
  url: string;
  personalizedFit?: string;
  isSteppingStone?: boolean;
}

export interface JobSearchOutput {
  passionRoles: JobDetails[];
  strengthRoles: JobDetails[];
  growthRoles: JobDetails[];
}

// Roadmap Types
export interface RoadmapUpdate {
  task: string;
  isCompleted: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  phase: string;
}

export interface Roadmap {
  id: string;
  jobTitle: string;
  company: string;
  tasks: RoadmapTask[];
  createdAt: string;
  updatedAt: string;
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  createdAt?: string;
}

export interface ChatInput {
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface RecommendationResponse {
  sessionId: string;
  recommendation: RecommendationOutput;
}

export interface ProfileUploadResponse {
  message: string;
  profilePictureUrl?: string;
  resumePath?: string;
}

export interface ChatResponse {
  reply: ChatMessage;
}

export interface SessionResponse {
  sessionId: string;
}

// File Upload Types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface JobSearchForm {
  query: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'connected' | 'disconnected';
    firebase: 'connected' | 'disconnected';
    ai: 'available' | 'unavailable';
  };
}
