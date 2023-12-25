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

describe('PUT /api/students/:id', () => {
  beforeAll(async () => {
    await db.raw('BEGIN');
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should update the correct student record', async () => {
    // Create a new student to update
    const newStudent = await db('students').insert(exampleStudent).returning('*');
    const studentId = newStudent[0].id;

    // New data for updating the student
    const updatedData = {
      first_name: 'updated',
      last_name: 'student',
      age: 22,
      email: 'updated@student.com',
    };

    const response = await request(app)
      .put(`/api/students/${studentId}`)
      .send(updatedData);

    // Expect a 200 status for a successful update
    expect(response.status).toBe(200);

    // Check if the response body has the correct success message
    expect(response.body).toHaveProperty('message', 'Student info updated successfully');

    // Query the database to ensure the student record was updated
    const updatedRecord = await db('students').where("id", studentId).first();
    expect(updatedRecord).toEqual(expect.objectContaining(updatedData));
  });

  test('should return 400 for invalid student ID', async () => {
    const invalidStudentId = 'invalid_id';
    const response = await request(app)
      .put(`/api/students/${invalidStudentId}`)
      .send(exampleStudent);

    // Expect a 400 status for an invalid student ID
    expect(response.status).toBe(400);
  });

  test('should return 404 for non-existent student', async () => {
    const nonExistentStudentId = 999;
    const response = await request(app)
      .put(`/api/students/${nonExistentStudentId}`)
      .send(exampleStudent);

    // Expect a 404 status for a non-existent student
    expect(response.status).toBe(404);
  });

  // Add more test cases as needed based on your application requirements
});
