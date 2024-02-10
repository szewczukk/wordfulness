import { Router } from 'express';
import UsersController from './users.controller.js';

export default function createUsersRouter(usersController: UsersController) {
	const router = Router();

	router.get('/users', usersController.fetchAllUsers);
	router.get('/schools/:id/users', usersController.fetchUsersInSchool);
	router.post('/users', usersController.create);
	router.delete('/users/:id', usersController.delete);

	return router;
}
