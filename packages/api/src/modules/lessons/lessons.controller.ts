import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response } from 'express';
import { paramsWithIdSchema } from '@/common/schemas.js';
import { lessons } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import { createLessonSchema, editLessonSchema } from './lessons.schemas.js';

export default class LessonsController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async fetchLessons(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const courseId = parseInt(params.id);

		const dbLessons = await this._db
			.select()
			.from(lessons)
			.where(eq(lessons.courseId, courseId));

		res.json(dbLessons);
	}

	async createLesson(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);
		const body = createLessonSchema.parse(req.body);

		const courseId = parseInt(params.id);

		const lesson = (
			await this._db
				.insert(lessons)
				.values({ courseId, name: body.name })
				.returning()
		)[0];

		res.json(lesson);
	}

	async fetchLesson(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const lessonId = parseInt(params.id);

		const lesson = (
			await this._db.select().from(lessons).where(eq(lessons.id, lessonId))
		)[0];

		res.json(lesson);
	}

	async updateLesson(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);
		const body = editLessonSchema.parse(req.body);

		const lessonId = parseInt(params.id);

		const lesson = (
			await this._db
				.update(lessons)
				.set(body)
				.where(eq(lessons.id, lessonId))
				.returning()
		)[0];

		res.json(lesson);
	}

	async deleteLesson(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const lessonId = parseInt(params.id);

		const lesson = (
			await this._db.delete(lessons).where(eq(lessons.id, lessonId)).returning()
		)[0];

		res.json(lesson);
	}
}
