import {
	char,
	integer,
	pgEnum,
	pgTable,
	serial,
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
	schoolId: integer('schoolId').references(() => schools.id),
	role: userRole('role').notNull(),
});
