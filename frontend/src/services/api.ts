import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import {
  IkigaiInput,
  RecommendationResponse,
  UserProfile,
  ProfileUploadResponse,
  JobSearchForm,
  JobSearchOutput,
  JobDetails,
  RoadmapUpdate,
  ChatSession,
  ChatMessage,
  ChatInput,
  ChatResponse,
  SessionResponse,
  HealthStatus,
  ApiResponse,
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private getToken: (() => Promise<string | null>) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (this.getToken) {
          const token = await this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  // Method to set the token getter function
  setTokenGetter(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Authentication required. Please log in.');
          break;
        case 403:
          toast.error('Access denied. You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          toast.error(data.error || 'Validation error');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.error || 'An unexpected error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }
  }

  // Health Check
  async getHealth(): Promise<HealthStatus> {
    const response = await this.client.get<HealthStatus>('/health');
    return response.data;
  }

  // Profile API
  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('/profile');
    return response.data;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.client.put<UserProfile>('/profile', profile);
    return response.data;
  }

  async uploadProfilePicture(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await this.client.post<ProfileUploadResponse>(
      '/profile/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async uploadResume(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('resumeFile', file);
    
    const response = await this.client.post<ProfileUploadResponse>(
      '/profile/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Recommendation API
  async createRecommendation(ikigaiData: IkigaiInput): Promise<RecommendationResponse> {
    const response = await this.client.post<RecommendationResponse>('/recommendation', ikigaiData);
    return response.data;
  }

  // Job Search API
  async searchJobs(searchData: JobSearchForm): Promise<JobSearchOutput> {
    const response = await this.client.post<JobSearchOutput>('/jobs/search', searchData);
    return response.data;
  }

  // Roadmap API
  async createRoadmap(jobDetails: JobDetails): Promise<RoadmapUpdate> {
    const response = await this.client.post<RoadmapUpdate>('/roadmaps', jobDetails);
    return response.data;
  }

  async updateRoadmapTask(roadmapId: string, taskUpdate: RoadmapUpdate): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/roadmaps/${roadmapId}/task`,
      taskUpdate
    );
    return response.data;
  }

  // Chat API
  async getChatSessions(): Promise<ChatSession[]> {
    const response = await this.client.get<ChatSession[]>('/chat/sessions');
    return response.data;
  }

  async createChatSession(): Promise<SessionResponse> {
    const response = await this.client.post<SessionResponse>('/chat/sessions');
    return response.data;
  }

  async getChatSession(sessionId: string): Promise<ChatMessage[]> {
    const response = await this.client.get<ChatMessage[]>(`/chat/sessions/${sessionId}`);
    return response.data;
  }

  async sendChatMessage(sessionId: string, message: ChatInput): Promise<ChatResponse> {
    const response = await this.client.post<ChatResponse>(
      `/chat/sessions/${sessionId}/messages`,
      message
    );
    return response.data;
  }

  // Knowledge API
  async uploadKnowledgeDocument(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await this.client.post<{ message: string }>(
      '/knowledge/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  getHealth,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  uploadResume,
  createRecommendation,
  searchJobs,
  createRoadmap,
  updateRoadmapTask,
  getChatSessions,
  createChatSession,
  getChatSession,
  sendChatMessage,
  uploadKnowledgeDocument,
} = apiClient;
