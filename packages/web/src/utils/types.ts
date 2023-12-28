import { z } from 'zod';

export const schoolSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export type School = z.infer<typeof schoolSchema>;
