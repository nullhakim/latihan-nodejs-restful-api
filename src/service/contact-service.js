import { createContactValidation } from '../validation/contact-validation.js';
import { validate } from '../validation/validation.js';
import { prismaClient } from "../application/database.js";

const create = async (user, request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user.username;

  prismaClient.user.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      phone: true
    }
  })

}

export default {
  create
}