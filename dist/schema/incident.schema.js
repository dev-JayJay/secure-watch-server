import z from 'zod';
export var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["PENDING"] = "pending";
    IncidentStatus["UNDER_REVIEW"] = "under_review";
    IncidentStatus["VERIFIED"] = "verified";
    IncidentStatus["REJECTED"] = "rejected";
    IncidentStatus["RESOLVED"] = "resolved";
    IncidentStatus["ESCALATED"] = "escalated";
    IncidentStatus["ARCHIVED"] = "archived";
})(IncidentStatus || (IncidentStatus = {}));
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
});
export const updateIncidentSchema = IncidentSchema.partial().extend({
    id: z.number(),
});
