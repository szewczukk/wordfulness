import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response } from 'express';
import { paramsWithIdSchema } from '@/common/schemas.js';
import { users } from '@/db/schema.js';
import { eq } from 'drizzle-orm';
import { createUserBodySchema, updateUserBodySchema } from './users.schemas.js';
import bcrypt from 'bcrypt';

export default class UsersController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async create(req: Request, res: Response) {
		const body = createUserBodySchema.parse(req.body);

		const password = await bcrypt.hash(body.password, 10);

		if (body.role !== 'superuser') {
			const result = await this._db
				.insert(users)
				.values({
					password,
					role: body.role,
					schoolId: body.schoolId,
					username: body.username,
				})
				.returning();

			return res.json({ ...result[0], password: undefined });
		}

		const result = await this._db
			.insert(users)
			.values({
				password,
				role: body.role,
				username: body.username,
			})
			.returning();

		res.json({ ...result[0], password: undefined });
	}

	async fetchUsersInSchool(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const id = parseInt(params.id);

		const result = await this._db
			.select()
			.from(users)
			.where(eq(users.schoolId, id));

		res.json(result);
	}

	async delete(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const id = parseInt(params.id);

		const user = (
			await this._db.delete(users).where(eq(users.id, id)).returning()
		)[0];

		res.json(user);
	}

	async fetchAllUsers(req: Request, res: Response) {
		const result = await this._db.select().from(users);

		const withoutPassword = result.map((user) => ({
			...user,
			password: undefined,
		}));

		res.json(withoutPassword);
	}

	async updateUser(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);
		const body = updateUserBodySchema.parse(req.body);

		const id = parseInt(params.id);

		const user = (
			await this._db
				.update(users)
				.set({ username: body.username })
				.where(eq(users.id, id))
				.returning()
		)[0];

		res.json(user);
	}
}
