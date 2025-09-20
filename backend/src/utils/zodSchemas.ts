import { z } from "zod";

// Your existing IkigaiInputSchema...
export const IkigaiInputSchema = z.object({
  interests: z.array(z.string()),
  skills: z.array(z.string()),
  values: z.array(z.string()),
  personalityType: z.string().optional(),
  location: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

// The new, updated RecommendationOutputSchema
export const RecommendationOutputSchema = z.object({
  personalizedSummary: z.string(),
  recommendedCareers: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      whyFit: z.string(),
      ikigaiAlignment: z.object({
        love: z.string(),
        goodAt: z.string(),
        worldNeeds: z.string(),
        paidFor: z.string(),
      }),
    })
  ),
  skillDevelopmentPlan: z.array(
    z.object({
      skill: z.string(),
      type: z.enum(["technical", "soft"]),
    })
  ),
  roadmap90Days: z.array(
    z.object({
      phase: z.string(), // e.g., "Week 1-4: Foundation"
      tasks: z.array(z.string()), // e.g., ["Complete SQL crash course", ...]
    })
  ),
});

export type IkigaiInput = z.infer<typeof IkigaiInputSchema>;
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

// --- Chat schemas and types ---
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "ai"]),
  content: z.string(),
  createdAt: z.any().optional(),
});

export const ChatInputSchema = z.object({
  content: z.string().min(1),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;

// --- USER PROFILE SCHEMAS ---

export const WorkExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  role: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const EducationSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  graduationDate: z.string(),
});

export const JobPreferencesSchema = z.object({
  jobTitles: z.array(z.string()).optional(),
  workModels: z.array(z.enum(['Remote', 'Hybrid', 'On-site'])).optional(),
  targetIndustries: z.array(z.string()).optional(),
});

export const UserProfileSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
  resumePath: z.string().optional(),
  skills: z.array(z.string()).optional(),
  workExperience: z.array(WorkExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  careerGoals: z.string().optional(),
  jobPreferences: JobPreferencesSchema.optional(),
  links: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// --- JOB SEARCH AND ROADMAP SCHEMAS ---


// --- JOB SEARCH AND ROADMAP SCHEMAS ---
export const JobDetailsSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  description: z.string(),
  url: z.string().url(),
  personalizedFit: z.string().optional(),
  isSteppingStone: z.boolean().optional(),
});

export const JobSearchOutputSchema = z.object({
  passionRoles: z.array(JobDetailsSchema),
  strengthRoles: z.array(JobDetailsSchema),
  growthRoles: z.array(JobDetailsSchema),
});

export const RoadmapUpdateSchema = z.object({
  task: z.string(),
  isCompleted: z.boolean(),
});
