import { z } from 'zod';

export const createSchoolBodySchema = z.object({
	name: z.string().min(1).max(20),
});
