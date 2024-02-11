import { Router } from 'express';
import RepetitionController from './repetition.controller.js';

export default function createRepetitionRoutes(
	repetitionController: RepetitionController
) {
	const router = Router();

	router.get('/deck', (req, res) =>
		repetitionController.fetchUsersDeck(req, res)
	);

	router.post('/deck', (req, res) =>
		repetitionController.addFlashcardToUsersDeck(req, res)
	);

	router.delete('/deck/:id', (req, res) =>
		repetitionController.removeFlashcardFromUsersDeck(req, res)
	);

	router.get('/deck/nth/:n', (req, res) =>
		repetitionController.fetchNthFlashcardFromDeck(req, res)
	);

	router.post('/deck/:id/increase', (req, res) =>
		repetitionController.increaseFlashcardScore(req, res)
	);

	return router;
}
