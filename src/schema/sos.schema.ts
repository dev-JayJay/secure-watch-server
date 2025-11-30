import * as z from "zod";


export const createSosSchema = z.object({
    message: z.string().min(1, "Message is required"),
    latitude: z.number({
        error: "Latitude is required",
    }),
    longitude: z.number({
        error: "Longitude is required",
    }),
    city: z.string().optional(),
});

export const updateSosSchema = z.object({
    message: z.string().min(1, "Message is required").optional(),
    latitude: z.number({
        error: "Latitude is required",
    }).optional(),
    longitude: z.number({
        error: "Longitude is required",
    }).optional(),
});