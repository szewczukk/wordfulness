import { Router } from 'express';
import SchoolsController from './schools.controller.js';

export default function createSchoolsRouter(
	schoolsController: SchoolsController
) {
	const router = Router();

	router.post('/schools', (req, res) => schoolsController.create(req, res));
	router.delete('/schools/:id', (req, res) =>
		schoolsController.delete(req, res)
	);
	router.get('/schools', (req, res) => schoolsController.fetchAll(req, res));
	router.get('/schools/:id', (req, res) => schoolsController.fetch(req, res));

	return router;
}
