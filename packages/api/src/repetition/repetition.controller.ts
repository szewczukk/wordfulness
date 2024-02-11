import { Request, Response } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, eq, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { jwtTokenSchema, paramsWithIdSchema } from '../common/schemas.js';
import { flashcards, flashcardsToUsers, users } from '../db/schema.js';
import {
	addFlashcardToDeckBodySchema,
	getNthFlashcardFromDeck,
} from './repetition.schemas.js';

export default class RepetitionController {
	private _db: PostgresJsDatabase;

	constructor(db: PostgresJsDatabase) {
		this._db = db;
	}

	async fetchUsersDeck(req: Request, res: Response) {
		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.sendStatus(403);
		}

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

		const usersFlashcard = await this._db
			.select()
			.from(flashcards)
			.leftJoin(
				flashcardsToUsers,
				eq(flashcards.id, flashcardsToUsers.flashcardId)
			)
			.where(eq(flashcardsToUsers.userId, user.id));

		res.json(usersFlashcard.map((uf) => uf.flashcards));
	}

	async addFlashcardToUsersDeck(req: Request, res: Response) {
		const body = addFlashcardToDeckBodySchema.parse(req.body);
		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.sendStatus(403);
		}

		const token = bearerToken.split(' ')[1];

		const payload = jwt.decode(token);

		if (!payload) {
			return res.sendStatus(400);
		}

		const result = jwtTokenSchema.parse(payload);

		const flashcard = (
			await this._db
				.select()
				.from(flashcards)
				.where(eq(flashcards.id, body.flashcardId))
				.limit(1)
		)[0];

		const user = (
			await this._db.select().from(users).where(eq(users.id, result.id))
		)[0];

		if (!user) {
			return res.sendStatus(403);
		}

		await this._db
			.insert(flashcardsToUsers)
			.values({ userId: user.id, flashcardId: flashcard.id, level: 0 });

		const usersFlashcard = await this._db
			.select()
			.from(flashcards)
			.leftJoin(
				flashcardsToUsers,
				eq(flashcards.id, flashcardsToUsers.flashcardId)
			)
			.where(eq(flashcardsToUsers.userId, user.id));

		res.json(usersFlashcard.map((uf) => uf.flashcards));
	}

	async removeFlashcardFromUsersDeck(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const flashcardId = parseInt(params.id);

		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.sendStatus(403);
		}

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

		await this._db
			.delete(flashcardsToUsers)
			.where(
				and(
					eq(flashcardsToUsers.userId, user.id),
					eq(flashcardsToUsers.flashcardId, flashcardId)
				)
			);

		const usersFlashcard = await this._db
			.select()
			.from(flashcards)
			.leftJoin(
				flashcardsToUsers,
				eq(flashcards.id, flashcardsToUsers.flashcardId)
			)
			.where(eq(flashcardsToUsers.userId, user.id));

		res.json(usersFlashcard.map((uf) => uf.flashcards));
	}

	async fetchNthFlashcardFromDeck(req: Request, res: Response) {
		const params = getNthFlashcardFromDeck.parse(req.params);
		const N = parseInt(params.n);

		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.sendStatus(403);
		}

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

		const usersFlashcard = await this._db
			.select()
			.from(flashcards)
			.leftJoin(
				flashcardsToUsers,
				eq(flashcards.id, flashcardsToUsers.flashcardId)
			)
			.where(eq(flashcardsToUsers.userId, user.id))
			.orderBy(asc(flashcardsToUsers.level))
			.limit(N + 1);

		if (usersFlashcard.length < N + 1) {
			res.json({});
			return;
		}

		res.json(usersFlashcard[N].flashcards);
	}

	async increaseFlashcardScore(req: Request, res: Response) {
		const params = paramsWithIdSchema.parse(req.params);

		const flashcardId = parseInt(params.id);

		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.sendStatus(403);
		}

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

		await this._db
			.update(flashcardsToUsers)
			.set({
				level: sql`${flashcardsToUsers.level} + 1`,
			})
			.where(
				and(
					eq(flashcardsToUsers.flashcardId, flashcardId),
					eq(flashcardsToUsers.userId, user.id)
				)
			);

		const usersFlashcard = (
			await this._db
				.select()
				.from(flashcards)
				.leftJoin(
					flashcardsToUsers,
					eq(flashcards.id, flashcardsToUsers.flashcardId)
				)
				.where(eq(flashcardsToUsers.userId, user.id))
				.orderBy(asc(flashcardsToUsers.level))
				.limit(1)
		)[0];

		res.json(usersFlashcard.flashcards);
	}
}
