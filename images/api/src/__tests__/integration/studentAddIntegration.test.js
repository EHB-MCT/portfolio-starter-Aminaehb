const request = require('supertest');
const app = require('./../../app.js');
const { v4: uuid } = require("uuid");

const knexfile = require('./../../db/knexfile.js');
const db = require("knex")(knexfile.development);

const exampleStudent = {
  UUID: uuid(),
  name: 'test',
  age: Math.floor(Math.random()* 99),
  classgroup: "DEV V",
  grade: Math.floor(Math.random()* 20)
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
    .send(exampleStudent)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', studentId);

    const dbRecord = await db('students').select("*").where("id", studentId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id', studentId);
  });
});
