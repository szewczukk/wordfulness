import { Router } from 'express';
import multer from 'multer';
import UsersController from './users.controller.js';

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1000 },
});

export default function createUsersRouter(usersController: UsersController) {
	const router = Router();

	router.get('/users', (req, res) => usersController.fetchAllUsers(req, res));
	router.get('/schools/:id/users', (req, res) =>
		usersController.fetchUsersInSchool(req, res)
	);
	router.post('/users', (req, res) => usersController.create(req, res));
	router.get('/users/:id', (req, res) => usersController.fechOne(req, res));
	router.delete('/users/:id', (req, res) => usersController.delete(req, res));
	router.patch('/users/:id', upload.single('avatar'), (req, res) =>
		usersController.updateUser(req, res)
	);

	return router;
}
