import z from 'zod';

export enum IncidentStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    VERIFIED = "verified",
    REJECTED = "rejected",
    RESOLVED = "resolved",
    ESCALATED = "escalated",
    ARCHIVED = "archived",
}


export const IncidentSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, 'Title is required'),
    type: z.string().min(1, 'Type is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    status: z.enum([IncidentStatus.ARCHIVED, IncidentStatus.ESCALATED, IncidentStatus.PENDING, IncidentStatus.REJECTED, IncidentStatus.RESOLVED, IncidentStatus.UNDER_REVIEW, IncidentStatus.VERIFIED]).default(IncidentStatus.PENDING),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    reported_by: z.number(),
    media_urls: z.array(z.string().url()).optional(),

});

export const updateIncidentSchema = IncidentSchema.partial().extend({
    id: z.number(),
}); 