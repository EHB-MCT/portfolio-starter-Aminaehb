const request = require('supertest');
const app = require('./../../app.js');
const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

describe('GET /students', () => {
  beforeAll(async () => {
    await db.raw('BEGIN');
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should return the correct student record', async () => {
    const studentId = 667;
    const response = await request(app).get(`/students/${studentId}`);

    // Expect a 200 status for an existing student
    expect(response.status).toBe(200);

    // Check if the response body has the correct student ID
    expect(response.body).toHaveProperty('id', studentId);

    // Query the database to ensure the student record exists
    const dbRecord = await db('students').select("*").where("id", studentId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id', studentId);
  });

  test('should return 404 for non-existent student', async () => {
    const nonExistentStudentId = 999;
    const response = await request(app).get(`/students/${nonExistentStudentId}`);

    // Expect a 404 status for a non-existent student
    expect(response.status).toBe(404);

    // Query the database to ensure there is no record for the non-existent student
    const dbRecord = await db('students').select("*").where("id", nonExistentStudentId);
    expect(dbRecord.length).toBe(0); // Expect no records for the non-existent student
  });

  test('should return 401 for negative studentID', async () => {
    const negativeStudentId = -1;
    const response = await request(app).get(`/students/${negativeStudentId}`);

    // Expect a 404 status for a negative student ID
    expect(response.status).toBe(401);
  });

  test('should return 401 for non-numeric studentID', async () => {
    const nonNumericStudentId = "hello";
    const response = await request(app).get(`/students/${nonNumericStudentId}`);

    // Expect a 401 status for a non-numeric student ID
    expect(response.status).toBe(401);
  });

  test('should return 401 for too large studentID', async () => {
    const tooLargeStudentId = 999999999999;
    const response = await request(app).get(`/students/${tooLargeStudentId}`);

    // Expect a 401 status for a too large student ID
    expect(response.status).toBe(401);
  });
});
