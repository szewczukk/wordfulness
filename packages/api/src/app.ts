import express from 'express';
import { courses, lessons, schools, users } from './db/schema.js';
import { z } from 'zod';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import bcrypt, { compareSync } from 'bcrypt';
import { eq } from 'drizzle-orm';
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

const deleteSchoolParamsSchema = z.object({
	id: z.string(),
});

app.delete('/schools/:id', async (req, res) => {
	const params = deleteSchoolParamsSchema.parse(req.params);

	const id = parseInt(params.id);

	const result = (
		await db.delete(schools).where(eq(schools.id, id)).returning()
	)[0];

	res.json(result);
});

app.get('/schools/:id/users', async (req, res) => {
	const params = deleteSchoolParamsSchema.parse(req.params);

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

const deleteUserParamsSchema = z.object({
	id: z.string(),
});

app.delete('/users/:id', async (req, res) => {
	const params = deleteUserParamsSchema.parse(req.params);

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

const createCourseParamsSchema = z.object({
	id: z.string(),
});

const createCourseBodySchema = z.object({
	name: z.string(),
});

app.post('/schools/:id/courses', async (req, res) => {
	const body = createCourseBodySchema.parse(req.body);
	const params = createCourseParamsSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const course = (
		await db.insert(courses).values({ name: body.name, schoolId }).returning()
	)[0];

	res.json(course);
});

const fetchCoursesParamsSchema = z.object({
	id: z.string(),
});

app.get('/schools/:id/courses', async (req, res) => {
	const params = fetchCoursesParamsSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const dbCourses = await db
		.select()
		.from(courses)
		.where(eq(courses.schoolId, schoolId));

	res.json(dbCourses);
});

const fetchCourseSchema = z.object({
	id: z.string(),
});

app.get('/courses/:id', async (req, res) => {
	const params = fetchCourseSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const course = (
		await db.select().from(courses).where(eq(courses.id, schoolId))
	)[0];

	res.json(course);
});

const updateCourseBodySchema = z.object({
	name: z.string().optional(),
});

app.patch('/courses/:id', async (req, res) => {
	const params = fetchCourseSchema.parse(req.params);

	const schoolId = parseInt(params.id);

	const body = updateCourseBodySchema.parse(req.body);

	const course = (
		await db
			.update(courses)
			.set(body)
			.where(eq(courses.id, schoolId))
			.returning()
	)[0];

	res.json(course);
});

app.get('/courses/:id/lessons', async (req, res) => {
	const params = fetchCourseSchema.parse(req.params);

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
	const params = fetchCourseSchema.parse(req.params);
	const body = createLessonSchema.parse(req.body);

	const courseId = parseInt(params.id);

	const lesson = (
		await db.insert(lessons).values({ courseId, name: body.name }).returning()
	)[0];

	res.json(lesson);
});

app.listen(3001, () => console.log('Listening on 3001..'));
