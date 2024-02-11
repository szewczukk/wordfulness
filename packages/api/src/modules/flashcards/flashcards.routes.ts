import { Router } from 'express';
import FlashcardsController from './flashcards.controller.js';

export default function createFlashcardsRoutes(
	flashcardsController: FlashcardsController
) {
	const router = Router();

	router.get('/lessons/:id/flashcards', (req, res) =>
		flashcardsController.fetchFlashcards(req, res)
	);

	router.post('/lessons/:id/flashcards', (req, res) =>
		flashcardsController.createFlashcard(req, res)
	);

	return router;
}
