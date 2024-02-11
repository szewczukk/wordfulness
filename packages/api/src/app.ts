import express from 'express';
import { flashcards, flashcardsToUsers, lessons, users } from './db/schema.js';
import { z } from 'zod';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { and, asc, eq, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import SchoolsController from './schools/schools.controller.js';
import { jwtTokenSchema, paramsWithIdSchema } from './common/schemas.js';
import createSchoolsRouter from './schools/schools.router.js';
import UsersController from './users/users.controller.js';
import createUsersRouter from './users/users.router.js';
import createAuthRoutes from './auth/auth.routes.js';
import AuthController from './auth/auth.controller.js';
import createCoursesRoutes from './courses/courses.routes.js';
import CoursesController from './courses/courses.controller.js';

const queryClient = postgres(
	'postgresql://postgres:zaq1@WSX@localhost:5432/wordfulnessjs?sslmode=disable'
);
const db = drizzle(queryClient);

const app = express();

const schoolsController = new SchoolsController(db);
const usersController = new UsersController(db);
const authController = new AuthController(db);
const coursesController = new CoursesController(db);

app.use(cors());
app.use(express.json());

app.use(createSchoolsRouter(schoolsController));
app.use(createUsersRouter(usersController));
app.use(createAuthRoutes(authController));
app.use(createCoursesRoutes(coursesController));

app.get('/courses/:id/lessons', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const courseId = parseInt(params.id);

	const dbLessons = await db
		.select()
		.from(lessons)
		.where(eq(lessons.courseId, courseId));

	res.json(dbLessons);
});

const createLessonSchema = z.object({
	name: z.string(),
});

app.post('/courses/:id/lessons', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);
	const body = createLessonSchema.parse(req.body);

	const courseId = parseInt(params.id);

	const lesson = (
		await db.insert(lessons).values({ courseId, name: body.name }).returning()
	)[0];

	res.json(lesson);
});

app.get('/lessons/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const lessonId = parseInt(params.id);

	const lesson = (
		await db.select().from(lessons).where(eq(lessons.id, lessonId))
	)[0];

	res.json(lesson);
});

const editLessonSchema = z.object({
	name: z.string(),
	description: z.string(),
});

app.patch('/lessons/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);
	const body = editLessonSchema.parse(req.body);

	const lessonId = parseInt(params.id);

	const lesson = (
		await db
			.update(lessons)
			.set(body)
			.where(eq(lessons.id, lessonId))
			.returning()
	)[0];

	res.json(lesson);
});

app.delete('/lessons/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const lessonId = parseInt(params.id);

	const lesson = (
		await db.delete(lessons).where(eq(lessons.id, lessonId)).returning()
	)[0];

	res.json(lesson);
});

app.get('/lessons/:id/flashcards', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const lessonId = parseInt(params.id);

	const lessons = await db
		.select()
		.from(flashcards)
		.where(eq(flashcards.lessonId, lessonId));

	res.json(lessons);
});

const createFlashcardSchema = z.object({
	front: z.string(),
	back: z.string(),
});

app.post('/lessons/:id/flashcards', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);
	const body = createFlashcardSchema.parse(req.body);

	const lessonId = parseInt(params.id);

	const lessons = (
		await db
			.insert(flashcards)
			.values({ front: body.front, back: body.back, lessonId })
			.returning()
	)[0];

	res.json(lessons);
});

app.get('/deck', async (req, res) => {
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
		await db.select().from(users).where(eq(users.id, result.id))
	)[0];

	if (!user) {
		return res.sendStatus(403);
	}

	const usersFlashcard = await db
		.select()
		.from(flashcards)
		.leftJoin(
			flashcardsToUsers,
			eq(flashcards.id, flashcardsToUsers.flashcardId)
		)
		.where(eq(flashcardsToUsers.userId, user.id));

	res.json(usersFlashcard.map((uf) => uf.flashcards));
});

const addFlashcardToDeckBodySchema = z.object({
	flashcardId: z.number(),
});

app.post('/deck', async (req, res) => {
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
		await db
			.select()
			.from(flashcards)
			.where(eq(flashcards.id, body.flashcardId))
			.limit(1)
	)[0];

	const user = (
		await db.select().from(users).where(eq(users.id, result.id))
	)[0];

	if (!user) {
		return res.sendStatus(403);
	}

	await db
		.insert(flashcardsToUsers)
		.values({ userId: user.id, flashcardId: flashcard.id, level: 0 });

	const usersFlashcard = await db
		.select()
		.from(flashcards)
		.leftJoin(
			flashcardsToUsers,
			eq(flashcards.id, flashcardsToUsers.flashcardId)
		)
		.where(eq(flashcardsToUsers.userId, user.id));

	res.json(usersFlashcard.map((uf) => uf.flashcards));
});

app.delete('/deck/:id', async (req, res) => {
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
		await db.select().from(users).where(eq(users.id, result.id))
	)[0];

	if (!user) {
		return res.sendStatus(403);
	}

	await db
		.delete(flashcardsToUsers)
		.where(
			and(
				eq(flashcardsToUsers.userId, user.id),
				eq(flashcardsToUsers.flashcardId, flashcardId)
			)
		);

	const usersFlashcard = await db
		.select()
		.from(flashcards)
		.leftJoin(
			flashcardsToUsers,
			eq(flashcards.id, flashcardsToUsers.flashcardId)
		)
		.where(eq(flashcardsToUsers.userId, user.id));

	res.json(usersFlashcard.map((uf) => uf.flashcards));
});

const getNthFlashcardFromDeck = z.object({
	n: z.string(),
});

app.get('/deck/nth/:n', async (req, res) => {
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
		await db.select().from(users).where(eq(users.id, result.id))
	)[0];

	if (!user) {
		return res.sendStatus(403);
	}

	const usersFlashcard = await db
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
});

app.post('/deck/:id/increase', async (req, res) => {
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
		await db.select().from(users).where(eq(users.id, result.id))
	)[0];

	if (!user) {
		return res.sendStatus(403);
	}

	await db
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
		await db
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
});

app.listen(3001, () => console.log('Listening on 3001..'));
