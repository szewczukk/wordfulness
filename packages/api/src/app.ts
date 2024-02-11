import express from 'express';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import cors from 'cors';
import dotenv from 'dotenv';
import SchoolsController from './modules/schools/schools.controller.js';
import createSchoolsRouter from './modules/schools/schools.router.js';
import UsersController from './modules/users/users.controller.js';
import createUsersRouter from './modules/users/users.router.js';
import createAuthRoutes from './modules/auth/auth.routes.js';
import AuthController from './modules/auth/auth.controller.js';
import createCoursesRoutes from './modules/courses/courses.routes.js';
import CoursesController from './modules/courses/courses.controller.js';
import createLessonsRoutes from './modules/lessons/lessons.routes.js';
import LessonsController from './modules/lessons/lessons.controller.js';
import FlashcardsController from './modules/flashcards/flashcards.controller.js';
import createFlashcardsRoutes from './modules/flashcards/flashcards.routes.js';
import RepetitionController from './modules/repetition/repetition.controller.js';
import createRepetitionRoutes from './modules/repetition/repetition.routes.js';
import { exit } from 'process';

dotenv.config();

if (!process.env.DB_URL) {
	console.error('DB_URL not set');
	exit(1);
}

const queryClient = postgres(process.env.DB_URL!);
const db = drizzle(queryClient);

const app = express();

const schoolsController = new SchoolsController(db);
const usersController = new UsersController(db);
const authController = new AuthController(db);
const coursesController = new CoursesController(db);
const lessonsController = new LessonsController(db);
const flashcardsController = new FlashcardsController(db);
const repetitionController = new RepetitionController(db);

app.use(cors());
app.use(express.json());

app.use(createSchoolsRouter(schoolsController));
app.use(createUsersRouter(usersController));
app.use(createAuthRoutes(authController));
app.use(createCoursesRoutes(coursesController));
app.use(createLessonsRoutes(lessonsController));
app.use(createFlashcardsRoutes(flashcardsController));
app.use(createRepetitionRoutes(repetitionController));

app.listen(3001, () => console.log('Listening on 3001..'));
