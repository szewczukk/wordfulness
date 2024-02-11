import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginBodySchema } from './auth.schemas.js';
import { users } from '../../db/schema.js';
import { jwtTokenSchema } from '../../common/schemas.js';

export default class AuthController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async login(req: Request, res: Response) {
		const body = loginBodySchema.parse(req.body);

		const user = (
			await this._db
				.select()
				.from(users)
				.where(eq(users.username, body.username))
		)[0];

		if (!user) {
			return res.sendStatus(404);
		}

		if (!bcrypt.compareSync(body.password, user.password)) {
			return res.sendStatus(403);
		}

		const token = jwt.sign({ id: user.id }, 'SECRET', { expiresIn: '7d' });

		res.json({ token });
	}

	async fetchLoggedInUser(req: Request, res: Response) {
		const bearerToken = req.headers.authorization;
		if (!bearerToken) {
			return res.sendStatus(403);
		}

		console.log(this);

		const token = bearerToken.split(' ')[1];

		const payload = jwt.decode(token);
		if (!payload) {
			return res.sendStatus(400);
		}

		const result = jwtTokenSchema.parse(payload);

		const user = (
			await this._db.select().from(users).where(eq(users.id, result.id))
		)[0];

		if (!user) {
			return res.sendStatus(403);
		}

		res.json({ ...user, password: undefined });
	}
}
