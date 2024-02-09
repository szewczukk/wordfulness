import { Router } from 'express';
import SchoolsController from './schools.controller.js';

export default function createSchoolsRouter(
	schoolsController: SchoolsController
) {
	const router = Router();

	router.post('/schools', schoolsController.create);
	router.delete('/schools/:id', schoolsController.delete);
	router.get('/schools', schoolsController.fetchAll);

	return router;
}
