import { Router } from 'express';
import LessonsController from './lessons.controller.js';

export default function createLessonsRoutes(
	lessonsController: LessonsController
) {
	const router = Router();

	router.get('/courses/:id/lessons', (req, res) =>
		lessonsController.fetchLessons(req, res)
	);

	router.post('/courses/:id/lessons', (req, res) =>
		lessonsController.createLesson(req, res)
	);

	router.get('/lessons/:id', (req, res) =>
		lessonsController.fetchLesson(req, res)
	);

	router.patch('/lessons/:id', (req, res) =>
		lessonsController.updateLesson(req, res)
	);

	router.delete('/lessons/:id', (req, res) =>
		lessonsController.deleteLesson(req, res)
	);

	return router;
}
