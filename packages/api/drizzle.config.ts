import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString:
			'postgresql://postgres:zaq1@WSX@localhost:5432/wordfulnessjs?sslmode=disable',
	},
	verbose: true,
	strict: true,
});
