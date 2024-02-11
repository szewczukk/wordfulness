import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { paramsWithIdSchema } from '@/common/schemas.js';
import { flashcards } from '@/db/schema.js';
import { createFlashcardSchema } from './flashcards.schemas.js';

export default class FlashcardsController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async fetchFlashcards(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const lessonId = parseInt(params.id);

		const lessons = await this._db
			.select()
			.from(flashcards)
			.where(eq(flashcards.lessonId, lessonId));

		res.json(lessons);
	}

	async createFlashcard(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);
		const body = createFlashcardSchema.parse(req.body);

		const lessonId = parseInt(params.id);

		const lessons = (
			await this._db
				.insert(flashcards)
				.values({ front: body.front, back: body.back, lessonId })
				.returning()
		)[0];

		res.json(lessons);
	}
}
