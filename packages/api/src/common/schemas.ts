import { z } from 'zod';

export const paramsWithIdSchema = z.object({
	id: z.string(),
});

export const jwtTokenSchema = z.object({
	id: z.number(),
});
