import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { paramsWithIdSchema } from '@/common/schemas.js';
import { users } from '@/db/schema.js';
import { createUserBodySchema, updateUserBodySchema } from './users.schemas.js';
import path from 'path';

export default class UsersController {
	private _db: PostgresJsDatabase;
	private _s3Client: S3Client;

	constructor(db: PostgresJsDatabase, s3: S3Client) {
		this._db = db;
		this._s3Client = s3;
	}

	async create(req: Request, res: Response) {
		const body = createUserBodySchema.parse(req.body);

		const password = await bcrypt.hash(body.password, 10);

		const defaultAvatarUrl = process.env.S3_DEFAULT_AVATAR_URL;
		if (!defaultAvatarUrl) {
			throw new Error('S3_DEFAULT_AVATAR_URL not set!');
		}

		if (body.role !== 'superuser') {
			const result = await this._db
				.insert(users)
				.values({
					password,
					role: body.role,
					schoolId: body.schoolId,
					username: body.username,
					avatarUrl: defaultAvatarUrl,
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
				avatarUrl: defaultAvatarUrl,
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

		let avatarUrl: string | undefined;
		if (req.file && req.file.size > 0) {
			const user = (
				await this._db.select().from(users).where(eq(users.id, id))
			)[0];

			if (user.avatarUrl !== process.env.S3_DEFAULT_AVATAR_URL) {
				const key = user.avatarUrl.replace(
					`${process.env.S3_AVATAR_BASE_URL}/`,
					''
				);

				try {
					await this._s3Client.send(
						new DeleteObjectCommand({
							Bucket: process.env.S3_BUCKET_NAME,
							Key: key,
						})
					);
				} catch (err) {
					console.error(err);
					throw err;
				}
			}

			const extension = path.extname(req.file.originalname);
			const key = `${crypto.randomUUID()}${extension}`;

			try {
				await this._s3Client.send(
					new PutObjectCommand({
						Bucket: process.env.S3_BUCKET_NAME,
						Key: key,
						Body: req.file.buffer,
						ACL: 'public-read',
					})
				);

				avatarUrl = `${process.env.S3_AVATAR_BASE_URL}/${key}`;
			} catch (err) {
				console.error(err);
				throw err;
			}
		}

		const user = (
			await this._db
				.update(users)
				.set({ username: body.username, avatarUrl })
				.where(eq(users.id, id))
				.returning()
		)[0];

		res.json({ ...user, password: undefined });
	}
}
