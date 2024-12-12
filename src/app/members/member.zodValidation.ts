import { z } from 'zod';

// Define individual sub-schemas
const nameZodSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(), // Optional as per TName type
  lastName: z.string().min(1, 'Last name is required'),
});

const addressZodSchema = z.object({
  streetAddress: z.string().optional(),
  area: z.string().min(1, 'Area is required'),
  city: z.string().min(1, 'City is required'),
  postCode: z
    .string()
    .min(4, 'Post code should be 4 digits')
    .max(4, 'Post code should be 4 digits'),
  district: z.string().min(1, 'District is required'),
  division: z.string().min(1, 'Division is required'),
  country: z.string().default('Bangladesh'),
});

const nominiZodSchema = z.object({
  name: nameZodSchema,
  nominiImg: z.string(),
  email: z.string().email('Invalid email format'),
  nominiPresentAddress: addressZodSchema,
  nominiPermanentAddress: addressZodSchema,
  nominyImg: z.string().min(1, 'Nominee image is required'),
  mob: z
    .string()
    .regex(/^\d+$/, 'Mobile number should contain only digits')
    .min(11, 'Mobile number cannot be less than 11 digits')
    .max(11, 'Mobile number cannot exceed 11 digits'),
  mobAlt: z
    .string()
    .regex(/^\d+$/, 'Alternate mobile number should contain only digits')
    .min(11, 'Alternate mobile number cannot be less than 11 digits')
    .max(11, 'Alternate mobile number cannot exceed 11 digits')
    .optional(), // Optional as per TNomini type
  nominiNID: z
    .string()
    .regex(/^\d+$/, 'NID should contain only digits')
    .min(1, 'NID is required'),
});

// Define main member schema
const createMemberZodSchema = z.object({
  body: z.object({
    user: z.object({
      email: z.string().email('Invalid email format'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    }),
    member: z.object({
      memberImg: z.string(),
      name: nameZodSchema,
      mob: z
        .string()
        .regex(/^\d+$/, 'Mobile number should contain only digits')
        .min(11, 'Mobile number cannot be less than 11 digits')
        .max(11, 'Mobile number cannot exceed 11 digits'),
      mobAlt: z
        .string()
        .regex(/^\d+$/, 'Alternate mobile number should contain only digits')
        .min(11, 'Alternate mobile number cannot be less than 11 digits')
        .max(11, 'Alternate mobile number cannot exceed 11 digits')
        .optional(), // Optional as per TMember type
      memberNID: z
        .string()
        .regex(/^\d+$/, 'NID should contain only digits')
        .min(1, 'NID is required'),

      membersNomini: nominiZodSchema,
      memberPermanentAddress: addressZodSchema,
      memberPresentAddress: addressZodSchema,
      isDelited: z.boolean().default(false),
    }),
  }),
});

//.......................update schema starts here ...............

const updateNameZodSchema = nameZodSchema.partial();
const updateAddressZodSchema = addressZodSchema.partial();

const updateNominiZodSchema = z.object({
  name: updateNameZodSchema,
  nominiImg: z.string(),
  email: z.string().email('Invalid email format'),
  nominiPresentAddress: updateAddressZodSchema,
  nominiPermanentAddress: updateAddressZodSchema,
  nominyImg: z.string().min(1, 'Nominee image is required'),
  mob: z
    .string()
    .regex(/^\d+$/, 'Mobile number should contain only digits')
    .min(11, 'Mobile number cannot be less than 11 digits')
    .max(11, 'Mobile number cannot exceed 11 digits'),
  mobAlt: z
    .string()
    .regex(/^\d+$/, 'Alternate mobile number should contain only digits')
    .min(11, 'Alternate mobile number cannot be less than 11 digits')
    .max(11, 'Alternate mobile number cannot exceed 11 digits')
    .optional(), // Optional as per TNomini type
  nominiNID: z
    .string()
    .regex(/^\d+$/, 'NID should contain only digits')
    .min(1, 'NID is required'),
});

const percialUpdateNominiZodSchema = updateNominiZodSchema.partial();

const memmberDataUpdateZodSchema = z.object({
  body: z.object({
    updatedData: z.object({
      memberImg: z.string().optional(),
      name: updateNameZodSchema.optional(),
      mob: z
        .string()
        .regex(/^\d+$/, 'Mobile number should contain only digits')
        .min(11, 'Mobile number cannot be less than 11 digits')
        .max(11, 'Mobile number cannot exceed 11 digits')
        .optional(),
      mobAlt: z
        .string()
        .regex(/^\d+$/, 'Alternate mobile number should contain only digits')
        .min(11, 'Alternate mobile number cannot be less than 11 digits')
        .max(11, 'Alternate mobile number cannot exceed 11 digits')
        .optional(), // Optional as per TMember type
      memberNID: z
        .string()
        .regex(/^\d+$/, 'NID should contain only digits')
        .min(1, 'NID is required')
        .optional(),

      membersNomini: percialUpdateNominiZodSchema.optional(),
      memberPermanentAddress: updateAddressZodSchema.optional(),
      memberPresentAddress: updateAddressZodSchema.optional(),
    }),
  }),
});

// Export for validation usage
export const memberValidations = {
  createMemberZodSchema,
  memmberDataUpdateZodSchema,
};
