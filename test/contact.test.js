import supertest from "supertest";
import { createTestUser, removeAllTestContacts, removeTestUser } from "./test-util";
import web from '../src/application/web.js';

describe('POST /api/contacts', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can create new contacts', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@mail.com",
        phone: "085466223669"
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@mail.com");
    expect(result.body.data.phone).toBe("085466223669");
  });
});