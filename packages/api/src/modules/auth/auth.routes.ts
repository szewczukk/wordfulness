import { Router } from 'express';
import AuthController from './auth.controller.js';

export default function createAuthRoutes(authController: AuthController) {
	const router = Router();

	router.post('/login', (req, res) => authController.login(req, res));
	router.get('/me', (req, res) => authController.fetchLoggedInUser(req, res));

	return router;
}
