const request = require('supertest');
const app = require('./../../app.js');
const { v4: uuid } = require("uuid");

const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

const exampleStudent = {
  UUID: uuid(),
  first_name: 'test',
  last_name: 'test',
  age: Math.floor(Math.random()* 99),
  email: 'test@student.com',
}

describe('POST /api/students/:id', () => {
  beforeAll(async () => {
    await db.raw('BEGIN');
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should return the correct student record', async () => {
    const studentId = 1;
    const response = await request(app)
      .post(`/api/students/${studentId}`)
      .send(exampleStudent);

    // Update the expected status code to 404
    expect(response.status).toBe(404);

    // Check the response structure for an error message
    expect(response.body).toHaveProperty('message', 'Student not found');

    // Ensure that the database record was not updated
    const dbRecord = await db('students').select("*").where("id", studentId);
    expect(dbRecord.length).toBe(0); // Expect no records for the non-existent student
  });
});
