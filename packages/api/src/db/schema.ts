import {
	char,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	varchar,
} from 'drizzle-orm/pg-core';

export const schools = pgTable('schools', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 20 }).notNull(),
});

export const userRole = pgEnum('user-role', [
	'superuser',
	'admin',
	'teacher',
	'student',
]);

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 20 }).unique().notNull(),
	password: char('password', { length: 60 }).notNull(),
	schoolId: integer('schoolId').references(() => schools.id, {
		onDelete: 'cascade',
	}),
	role: userRole('role').notNull(),
});

export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 20 }).notNull(),
	schoolId: integer('schoolId')
		.notNull()
		.references(() => schools.id, { onDelete: 'cascade' }),
});

export const lessons = pgTable('lessons', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 20 }).notNull(),
	description: text('description').default('').notNull(),
	courseId: integer('courseId')
		.notNull()
		.references(() => courses.id, { onDelete: 'cascade' }),
});
