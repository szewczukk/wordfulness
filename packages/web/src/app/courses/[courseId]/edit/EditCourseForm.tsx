'use client';

import Button from '@/ui/Button';
import Input from '@/ui/Input';
import { Course } from '@/utils/types';
import { deleteCourse, editCourseFormAction } from './actions';

type Props = {
	course: Course;
};

export default function EditCourseForm({ course }: Props) {
	return (
		<div className="card bg-base-200">
			<div className="card-body">
				<h1 className="card-title">Edit {course.name}</h1>
				<form
					action={editCourseFormAction}
					id="edit-course-form"
					className="flex flex-col items-start gap-2"
				>
					<input
						type="number"
						name="courseId"
						defaultValue={course.id}
						hidden
					/>
					<label htmlFor="name">Course name</label>
					<Input type="text" name="name" defaultValue={course.name} id="name" />
					<textarea
						id="description"
						name="description"
						className="textarea textarea-bordered h-64 w-80 resize-none"
					>
						{course.description}
					</textarea>
				</form>
				<div className="card-actions justify-end">
					<Button className="btn-success" form="edit-course-form">
						Save
					</Button>
					<Button
						type="submit"
						className="btn-error"
						onClick={() => deleteCourse(course.id)}
					>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}
