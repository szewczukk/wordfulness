import { Router } from 'express';
import UsersController from './users.controller.js';

export default function createUsersRouter(usersController: UsersController) {
	const router = Router();

	router.get('/users', (req, res) => usersController.fetchAllUsers(req, res));
	router.get('/schools/:id/users', (req, res) =>
		usersController.fetchUsersInSchool(req, res)
	);
	router.post('/users', (req, res) => usersController.create(req, res));
	router.delete('/users/:id', (req, res) => usersController.delete(req, res));
	router.patch('/users/:id', (req, res) =>
		usersController.updateUser(req, res)
	);

	return router;
}
