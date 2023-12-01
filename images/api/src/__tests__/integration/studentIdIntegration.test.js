const request = require('supertest');
const app = require('./../../app.js');
const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

describe('GET /students/:id', () => {
  beforeAll(async () => {
    await db.raw('BEGIN');
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should return the correct student record', async () => {
    const studentId = 1;
    const response = await request(app).get(`/students/${studentId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', studentId);
  

    const dbRecord = await db('students').select("*").where("id", studentId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id', studentId);
  });
  test('should return 404 for non-existent student', async () => {
    const nonExistentStudentId = 999;
    const response = await request(app).get(`/students/${nonExistentStudentId}`);
    expect(response.status).toBe(404);

    const dbRecord = await db('students').select("*").where("id", studentId);
    expect(dbRecord.length).toBeGreaterThan(0);
  });
  test('should return 401 for negative studentID', async () => {
    const nonExistentStudentId = -1;
    const response = await request(app).get(`/students/${nonExistentStudentId}`);
    expect(response.status).toBe(401);
  });
  test('should return 401 for negative studentID', async () => {
    const nonExistentStudentId = "hello";
    const response = await request(app).get(`/students/${nonExistentStudentId}`);
    expect(response.status).toBe(401);
  });
  test('should return 401 for too large studentID', async () => {
    const nonExistentStudentId = 999999999999;
    const response = await request(app).get(`/students/${nonExistentStudentId}`);
    expect(response.status).toBe(401);
  });
});
