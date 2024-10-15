import supertest from "supertest";
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });
  it("should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/` + testContact.id + `/addresses`)
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
        postal_code: "45879",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan test");
    expect(result.body.data.city).toBe("kota test");
    expect(result.body.data.province).toBe("provinsi test");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("45879");
  });

  it("should reject create if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/` + testContact.id + `/addresses`)
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "",
        postal_code: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });

  it("should reject create if contact not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/` + (testContact.id + 1) + `/addresses`)
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
        postal_code: "45879",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get contact address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/` + testContact.id + `/addresses/` + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan test");
    expect(result.body.data.city).toBe("kota test");
    expect(result.body.data.province).toBe("provinsi test");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("234234");
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        `/api/contacts/` + (testContact.id + 1) + `/addresses/` + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        `/api/contacts/` + testContact.id + `/addresses/` + (testAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/` + testContact.id + `/addresses/` + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "jalan test update",
        city: "kota test update",
        province: "provinsi test update",
        country: "indonesia update",
        postal_code: "4587902",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress.id);
    expect(result.body.data.street).toBe("jalan test update");
    expect(result.body.data.city).toBe("kota test update");
    expect(result.body.data.province).toBe("provinsi test update");
    expect(result.body.data.country).toBe("indonesia update");
    expect(result.body.data.postal_code).toBe("4587902");
  });

  it("should reject if request is not valid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/` + testContact.id + `/addresses/` + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "jalan test update",
        city: "kota test update",
        province: "provinsi test update",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
  });

  it("should reject if address not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        `/api/contacts/` + testContact.id + `/addresses/` + (testAddress.id + 1)
      )
      .set("Authorization", "test")
      .send({
        street: "jalan test update",
        city: "kota test update",
        province: "provinsi test update",
        country: "indonesia update",
        postal_code: "4587902",
      });

    expect(result.status).toBe(404);
  });

  it("should reject if contact not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        `/api/contacts/` + (testContact.id + 1) + `/addresses/` + testAddress.id
      )
      .set("Authorization", "test")
      .send({
        street: "jalan test update",
        city: "kota test update",
        province: "provinsi test update",
        country: "indonesia update",
        postal_code: "4587902",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can delete address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        `/api/contacts/` + testContact.id + `/addresses/` + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        `/api/contacts/` + testContact.id + `/addresses/` + (testAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        `/api/contacts/` + (testContact.id + 1) + `/addresses/` + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can list addresss", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/` + testContact.id + `/addresses/`)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/` + testContact.id + 1 + `/addresses/`)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});
