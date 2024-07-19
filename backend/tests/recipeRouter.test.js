const request = require('supertest');
const app = require('../src/app');

describe('GET /recipes', () => {
	it('should return a code 200 with json', () => {
		return request(app)
			.get('/recipes')
			.expect('Content-Type', /json/)
			.expect(200)
	});
});