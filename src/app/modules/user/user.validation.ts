import { AddressProofDocType, IdVerificationDocType } from '@prisma/client';
import { z } from 'zod';

export const bnvVerificationInputZodSchema = z.object({
    body: z.object({
        bvn: z.string({
            required_error: 'bnv is required',
        }),

        gender: z.string({
            required_error: 'gender is required',
        }),

        dateOfBirth: z.string({
            required_error: 'DOB is required',
        }),
    }),
});

export const idVerificationInputZodSchema = z.object({
    body: z.object({
        documentType: z.enum([
            IdVerificationDocType.voter_id,
            IdVerificationDocType.driver_license,
            IdVerificationDocType.international_passport,
        ]),

        idNumber: z.string({
            required_error: 'id number is required',
        }),

        image: z.string({
            required_error: 'image is required',
        }),
    }),
});

export const proofOfAddressInputZodSchema = z.object({
    body: z.object({
        documentType: z.enum([
            AddressProofDocType.water_bill,
            AddressProofDocType.waste_bil,
            AddressProofDocType.electricity_bill,
            AddressProofDocType.cable_bill,
        ]),

        address: z.string({
            required_error: 'address is required',
        }),

        image: z.string({
            required_error: 'image is required',
        }),

        state: z.string({
            required_error: 'state is required',
        }),

        localGovernment: z.string({
            required_error: 'local government is required',
        }),

        city: z.string({
            required_error: 'city is required',
        }),
    }),
});

export const nextOfKinInputZodSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email format.',
            })
            .trim(),

        firstName: z.string({
            required_error: 'first name is required',
        }),

        gender: z.string({
            required_error: 'gender is required',
        }),

        lastName: z.string({
            required_error: 'last name is required',
        }),

        relationship: z.string({
            required_error: 'relationship is required',
        }),

        phone: z.string({
            required_error: 'phone is required',
        }),

        address: z.string({
            required_error: 'address is required',
        }),
    }),
});

export const addCardInputZodSchema = z.object({
    body: z.object({
        cardNumber: z.string({
            required_error: 'card number is required',
        }),

        cardHolderName: z.string({
            required_error: 'card holder name is required',
        }),

        cvv: z.string({
            required_error: 'cvv is required',
        }),

        expiryDate: z.string({
            required_error: 'expiry date is required',
        }),
    }),
});

export const addMoneyInputZodSchema = z.object({
    body: z.object({
        amount: z
            .number({
                required_error: 'amount is required',
            })
            .min(1),
    }),
});
