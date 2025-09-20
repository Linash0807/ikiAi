"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapUpdateSchema = exports.JobSearchOutputSchema = exports.JobDetailsSchema = exports.UserProfileSchema = exports.JobPreferencesSchema = exports.EducationSchema = exports.WorkExperienceSchema = exports.ChatInputSchema = exports.ChatMessageSchema = exports.RecommendationOutputSchema = exports.IkigaiInputSchema = void 0;
const zod_1 = require("zod");
// Your existing IkigaiInputSchema...
exports.IkigaiInputSchema = zod_1.z.object({
    interests: zod_1.z.array(zod_1.z.string()),
    skills: zod_1.z.array(zod_1.z.string()),
    values: zod_1.z.array(zod_1.z.string()),
    personalityType: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    goals: zod_1.z.array(zod_1.z.string()).optional(),
});
// The new, updated RecommendationOutputSchema
exports.RecommendationOutputSchema = zod_1.z.object({
    personalizedSummary: zod_1.z.string(),
    recommendedCareers: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        whyFit: zod_1.z.string(),
        ikigaiAlignment: zod_1.z.object({
            love: zod_1.z.string(),
            goodAt: zod_1.z.string(),
            worldNeeds: zod_1.z.string(),
            paidFor: zod_1.z.string(),
        }),
    })),
    skillDevelopmentPlan: zod_1.z.array(zod_1.z.object({
        skill: zod_1.z.string(),
        type: zod_1.z.enum(["technical", "soft"]),
    })),
    roadmap90Days: zod_1.z.array(zod_1.z.object({
        phase: zod_1.z.string(), // e.g., "Week 1-4: Foundation"
        tasks: zod_1.z.array(zod_1.z.string()), // e.g., ["Complete SQL crash course", ...]
    })),
});
// --- Chat schemas and types ---
exports.ChatMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(["user", "ai"]),
    content: zod_1.z.string(),
    createdAt: zod_1.z.any().optional(),
});
exports.ChatInputSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
});
// --- USER PROFILE SCHEMAS ---
exports.WorkExperienceSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    role: zod_1.z.string(),
    company: zod_1.z.string(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.EducationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    institution: zod_1.z.string(),
    degree: zod_1.z.string(),
    fieldOfStudy: zod_1.z.string().optional(),
    graduationDate: zod_1.z.string(),
});
exports.JobPreferencesSchema = zod_1.z.object({
    jobTitles: zod_1.z.array(zod_1.z.string()).optional(),
    workModels: zod_1.z.array(zod_1.z.enum(['Remote', 'Hybrid', 'On-site'])).optional(),
    targetIndustries: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UserProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    headline: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
    profilePictureUrl: zod_1.z.string().url().optional(),
    resumePath: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    workExperience: zod_1.z.array(exports.WorkExperienceSchema).optional(),
    education: zod_1.z.array(exports.EducationSchema).optional(),
    careerGoals: zod_1.z.string().optional(),
    jobPreferences: exports.JobPreferencesSchema.optional(),
    links: zod_1.z.object({
        linkedin: zod_1.z.string().url().optional(),
        github: zod_1.z.string().url().optional(),
        portfolio: zod_1.z.string().url().optional(),
    }).optional(),
});
// --- JOB SEARCH AND ROADMAP SCHEMAS ---
// --- JOB SEARCH AND ROADMAP SCHEMAS ---
exports.JobDetailsSchema = zod_1.z.object({
    title: zod_1.z.string(),
    company: zod_1.z.string(),
    location: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    url: zod_1.z.string().url(),
    personalizedFit: zod_1.z.string().optional(),
    isSteppingStone: zod_1.z.boolean().optional(),
});
exports.JobSearchOutputSchema = zod_1.z.object({
    passionRoles: zod_1.z.array(exports.JobDetailsSchema),
    strengthRoles: zod_1.z.array(exports.JobDetailsSchema),
    growthRoles: zod_1.z.array(exports.JobDetailsSchema),
});
exports.RoadmapUpdateSchema = zod_1.z.object({
    task: zod_1.z.string(),
    isCompleted: zod_1.z.boolean(),
});
