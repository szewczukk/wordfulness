import { Router } from 'express';
import CoursesController from './courses.controller.js';

export default function createCoursesRoutes(
	coursesController: CoursesController
) {
	const router = Router();

	router.post('/schools/:id/courses', (req, res) =>
		coursesController.createCourse(req, res)
	);

	router.get('/schools/:id/courses', (req, res) =>
		coursesController.fetchCoursesForSchool(req, res)
	);

	router.get('/courses/:id', (req, res) =>
		coursesController.fetchCourse(req, res)
	);

	router.patch('/courses/:id', (req, res) =>
		coursesController.updateCourse(req, res)
	);

	router.delete('/courses/:id', (req, res) =>
		coursesController.deleteCourse(req, res)
	);

	return router;
}
