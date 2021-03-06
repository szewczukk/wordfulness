import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFlashcardInput } from './dto/create-flashcard.input';
import { UpdateFlashcardInput } from './dto/update-flashcard.input';
import { Flashcard } from './entities/flashcard.entity';

@Injectable()
export class FlashcardsService {
	constructor(
		@InjectRepository(Flashcard)
		private usersRepository: Repository<Flashcard>,
	) {}

	create({ lessonId, ...rest }: CreateFlashcardInput) {
		const flashcard = this.usersRepository.save({
			...rest,
			lesson: { id: lessonId },
		});
		return flashcard;
	}

	findAll() {
		return this.usersRepository.find({ relations: ['lesson'] });
	}

	findOne(id: number) {
		return this.usersRepository.findOne({
			where: { id },
			relations: ['lesson'],
		});
	}

	async update(id: number, updateFlashcardInput: UpdateFlashcardInput) {
		// TODO: REFACTOR THIS TO ONE QUERY
		await this.usersRepository.update({ id }, { ...updateFlashcardInput });
		return this.findOne(updateFlashcardInput.id);
	}

	async remove(id: number) {
		const result = await this.usersRepository.delete(id);
		return result.affected !== 0;
	}
}
