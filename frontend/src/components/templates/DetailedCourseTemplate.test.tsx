import React from 'react';
import { describe, it, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import DetailedCourseTemplate from './DetailedCourseTemplate';
import { MemoryRouter } from 'react-router-dom';

describe('DetailedCourseTemplate', () => {
	it("It doesn't render empty array", () => {
		render(
			<DetailedCourseTemplate onSubmit={vi.fn()} onLogoutClick={vi.fn()} />,
		);

		screen.getByText(/No lessons!/);
	});

	it('It renders array with lessons', () => {
		render(
			<DetailedCourseTemplate
				onSubmit={vi.fn()}
				lessons={[
					{ id: '0', name: 'Hello' },
					{ id: '1', name: 'World' },
				]}
				onLogoutClick={vi.fn()}
			/>,
			{ wrapper: MemoryRouter },
		);

		screen.getByText(/Lessons:/);
		screen.getByText(/Hello/);
		screen.getByText(/World/);
	});
});
