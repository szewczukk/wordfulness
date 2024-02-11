import express from 'express';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import cors from 'cors';
import SchoolsController from './schools/schools.controller.js';
import createSchoolsRouter from './schools/schools.router.js';
import UsersController from './users/users.controller.js';
import createUsersRouter from './users/users.router.js';
import createAuthRoutes from './auth/auth.routes.js';
import AuthController from './auth/auth.controller.js';
import createCoursesRoutes from './courses/courses.routes.js';
import CoursesController from './courses/courses.controller.js';
import createLessonsRoutes from './lessons/lessons.routes.js';
import LessonsController from './lessons/lessons.controller.js';
import FlashcardsController from './flashcards/flashcards.controller.js';
import createFlashcardsRoutes from './flashcards/flashcards.routes.js';
import RepetitionController from './repetition/repetition.controller.js';
import createRepetitionRoutes from './repetition/repetition.routes.js';

const queryClient = postgres(
	'postgresql://postgres:zaq1@WSX@localhost:5432/wordfulnessjs?sslmode=disable'
);
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
