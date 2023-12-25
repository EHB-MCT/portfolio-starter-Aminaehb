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

describe('DELETE /api/students/:id', () => {
  beforeAll(async () => {
    await db.raw('BEGIN');
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should delete the correct student record', async () => {
    // Insert a sample student to delete
    const insertedStudent = await db('students').insert(exampleStudent).returning('*');
    const studentIdToDelete = insertedStudent[0].id;

    const response = await request(app)
      .delete(`/api/students/${studentIdToDelete}`);

    // Expect a 200 status for a successful deletion
    expect(response.status).toBe(200);

    // Check the response structure for a success message
    expect(response.body).toHaveProperty('message', 'Student deleted successfully');

    // Query the database to ensure the student record was deleted
    const dbRecord = await db('students').select("*").where("id", studentIdToDelete);
    expect(dbRecord.length).toBe(0); // Expect no records for the deleted student
  });

  test('should return 404 for non-existent student', async () => {
    const nonExistentStudentId = 999;
    const response = await request(app).delete(`/api/students/${nonExistentStudentId}`);

    // Expect a 404 status for a non-existent student
    expect(response.status).toBe(404);
  });
});
