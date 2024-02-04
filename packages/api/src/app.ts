import express from 'express';
import {
	courses,
	flashcards,
	flashcardsToUsers,
	lessons,
	schools,
	users,
} from './db/schema.js';
import { z } from 'zod';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import bcrypt, { compareSync } from 'bcrypt';
import { and, desc, eq, sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const queryClient = postgres(
	'postgresql://postgres:zaq1@WSX@localhost:5432/wordfulnessjs?sslmode=disable'
);
const db = drizzle(queryClient);

const app = express();

app.use(cors());
app.use(express.json());

const createSchoolBodySchema = z.object({
	name: z.string().min(1).max(20),
});

app.post('/schools', async (req, res) => {
	const body = createSchoolBodySchema.parse(req.body);

	const result = await db
		.insert(schools)
		.values({ name: body.name })
		.returning();

	res.json(result[0]);
});

const paramsWithIdSchema = z.object({
	id: z.string(),
});

app.delete('/schools/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const id = parseInt(params.id);

	const result = (
		await db.delete(schools).where(eq(schools.id, id)).returning()
	)[0];

	res.json(result);
});

app.get('/schools/:id/users', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const id = parseInt(params.id);

	const result = await db.select().from(users).where(eq(users.schoolId, id));

	res.json(result);
});

app.get('/schools', async (req, res) => {
	const result = await db.select().from(schools);

	res.json(result);
});

const createUserBodySchema = z
	.object({
		username: z.string().min(1).max(20),
		password: z.string().min(1).max(20),
		role: z.literal('superuser'),
	})
	.or(
		z.object({
			username: z.string().min(1).max(20),
			password: z.string().min(1).max(20),
			role: z.enum(['admin', 'teacher', 'student']),
			schoolId: z.number(),
		})
	);

app.post('/users', async (req, res) => {
	const body = createUserBodySchema.parse(req.body);

	const password = await bcrypt.hash(body.password, 10);

	if (body.role !== 'superuser') {
		const result = await db
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

	const result = await db
		.insert(users)
		.values({
			password,
			role: body.role,
			username: body.username,
		})
		.returning();

	res.json({ ...result[0], password: undefined });
});

app.get('/users', async (req, res) => {
	const result = await db.select().from(users);

	const withoutPassword = result.map((user) => ({
		...user,
		password: undefined,
	}));

	res.json(withoutPassword);
});

app.delete('/users/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const id = parseInt(params.id);

	const user = (await db.delete(users).where(eq(users.id, id)).returning())[0];

	res.json(user);
});

const loginBodySchema = z.object({
	username: z.string().min(1).max(20),
	password: z.string().min(1).max(20),
});

app.post('/login', async (req, res) => {
	const body = loginBodySchema.parse(req.body);

	const result = await db
		.select()
		.from(users)
		.where(eq(users.username, body.username));

	const user = result[0];

	if (!user) {
		return res.sendStatus(404);
	}

	if (!compareSync(body.password, user.password)) {
		return res.sendStatus(403);
	}

	const token = jwt.sign({ id: user.id }, 'SECRET', { expiresIn: '7d' });

	res.json({ token });
});

const jwtTokenSchema = z.object({
	id: z.number(),
});

app.get('/me', async (req, res) => {
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

	res.json({ ...user, password: undefined });
});

const createCourseBodySchema = z.object({
	name: z.string(),
});

app.post('/schools/:id/courses', async (req, res) => {
	const body = createCourseBodySchema.parse(req.body);
	const params = paramsWithIdSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const course = (
		await db.insert(courses).values({ name: body.name, schoolId }).returning()
	)[0];

	res.json(course);
});

app.get('/schools/:id/courses', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const dbCourses = await db
		.select()
		.from(courses)
		.where(eq(courses.schoolId, schoolId));

	res.json(dbCourses);
});

app.get('/courses/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const courseId = parseInt(params.id);

	const course = (
		await db.select().from(courses).where(eq(courses.id, courseId))
	)[0];

	res.json(course);
});

const updateCourseBodySchema = z.object({
	name: z.string().optional(),
});

app.patch('/courses/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);
	const body = updateCourseBodySchema.parse(req.body);

	const courseId = parseInt(params.id);

	const course = (
		await db
			.update(courses)
			.set(body)
			.where(eq(courses.id, courseId))
			.returning()
	)[0];

	res.json(course);
});

app.delete('/courses/:id', async (req, res) => {
	const params = paramsWithIdSchema.parse(req.params);

	const courseId = parseInt(params.id);

	const course = (
		await db.delete(courses).where(eq(courses.id, courseId)).returning()
	)[0];

	res.json(course);
});

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
		.orderBy(desc(flashcardsToUsers.level))
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
			.orderBy(desc(flashcardsToUsers.level))
			.limit(1)
	)[0];

	res.json(usersFlashcard.flashcards);
});

app.listen(3001, () => console.log('Listening on 3001..'));
