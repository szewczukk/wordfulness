import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
	createCourseBodySchema,
	updateCourseBodySchema,
} from './courses.schemas.js';
import { paramsWithIdSchema } from '../../common/schemas.js';
import { Request, Response } from 'express';
import { courses } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default class CoursesController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async createCourse(req: Request, res: Response) {
		const body = createCourseBodySchema.parse(req.body);
		const params = paramsWithIdSchema.parse(req.params);

		const schoolId = parseInt(params.id);

		const course = (
			await this._db
				.insert(courses)
				.values({ name: body.name, schoolId })
				.returning()
		)[0];

		res.json(course);
	}

	async fetchCoursesForSchool(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const schoolId = parseInt(params.id);

		const dbCourses = await this._db
			.select()
			.from(courses)
			.where(eq(courses.schoolId, schoolId));

		res.json(dbCourses);
	}

	async fetchCourse(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const courseId = parseInt(params.id);

		const course = (
			await this._db.select().from(courses).where(eq(courses.id, courseId))
		)[0];

		res.json(course);
	}

	async updateCourse(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);
		const body = updateCourseBodySchema.parse(req.body);

		const courseId = parseInt(params.id);

		const course = (
			await this._db
				.update(courses)
				.set(body)
				.where(eq(courses.id, courseId))
				.returning()
		)[0];

		res.json(course);
	}

	async deleteCourse(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const courseId = parseInt(params.id);

		const course = (
			await this._db.delete(courses).where(eq(courses.id, courseId)).returning()
		)[0];

		res.json(course);
	}
}
