'use client';

import Button from '@/ui/Button';
import Input from '@/ui/Input';
import { Lesson } from '@/utils/types';
import { deleteLesson, editLessonFormAction } from './actions';

type Props = {
	lesson: Lesson;
};

export default function EditLessonForm({ lesson }: Props) {
	return (
		<div className="card bg-base-200">
			<div className="card-body">
				<h1 className="card-title">Edit {lesson.name}</h1>
				<form
					action={editLessonFormAction}
					id="edit-course-form"
					className="flex flex-col items-start gap-2"
				>
					<input
						type="number"
						name="lessonId"
						defaultValue={lesson.id}
						hidden
					/>
					<label htmlFor="name">Lesson name</label>
					<Input type="text" name="name" defaultValue={lesson.name} id="name" />
					<textarea
						id="description"
						name="description"
						className="textarea textarea-bordered h-64 w-80 resize-none"
					>
						{lesson.description}
					</textarea>
				</form>
				<div className="card-actions justify-end">
					<Button className="btn-success" form="edit-course-form">
						Save
					</Button>
					<Button
						type="submit"
						className="btn-error"
						onClick={() => deleteLesson(lesson.id, lesson.courseId)}
					>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}
