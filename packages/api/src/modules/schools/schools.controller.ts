import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response } from 'express';
import { schools } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import { paramsWithIdSchema } from '@/common/schemas.js';
import { createSchoolBodySchema } from './schools.schemas.js';

export default class SchoolsController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async create(req: Request, res: Response) {
		const body = createSchoolBodySchema.parse(req.body);

		const result = await this._db
			.insert(schools)
			.values({ name: body.name })
			.returning();

		res.json(result[0]);
	}

	async delete(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const id = parseInt(params.id);

		const result = (
			await this._db.delete(schools).where(eq(schools.id, id)).returning()
		)[0];

		res.json(result);
	}

	async fetchAll(req: Request, res: Response) {
		const result = await this._db.select().from(schools);

		res.json(result);
	}
}
