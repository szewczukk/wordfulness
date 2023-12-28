import { relations } from 'drizzle-orm';
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

export const schoolsRelations = relations(schools, ({ many }) => ({
	users: many(users),
}));

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
	schoolId: integer('schoolId'),
	role: userRole('role').notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
	school: one(schools, { fields: [users.schoolId], references: [schools.id] }),
}));
