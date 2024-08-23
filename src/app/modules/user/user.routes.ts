import { Router } from 'express';
import { roleVerifier, zodValidator } from '../../../shared';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';
import { UserModules } from './user.modules';
import {
    addCardInputZodSchema,
    addMoneyInputZodSchema,
    bnvVerificationInputZodSchema,
    idVerificationInputZodSchema,
    nextOfKinInputZodSchema,
    proofOfAddressInputZodSchema,
} from './user.validation';

const router = Router();
const userModules = new UserModules();
const {
    bvnVerification,
    idVerification,
    proofOfAddress,
    nextOfKin,
    getAllTransactions,
    getTransactionById,
    addCard,
    addMoneyUsingCard,
} = userModules.userControllers;

router.post(
    '/verify-bvn',
    zodValidator(bnvVerificationInputZodSchema),
    roleVerifier('user'),
    asyncHandler(bvnVerification.bind(userModules))
);

router.post(
    '/verify-id',
    zodValidator(idVerificationInputZodSchema),
    roleVerifier('user'),
    asyncHandler(idVerification.bind(userModules))
);

router.post(
    '/verify-address',
    zodValidator(proofOfAddressInputZodSchema),
    roleVerifier('user'),
    asyncHandler(proofOfAddress.bind(userModules))
);

router.post(
    '/add-next-of-kin',
    zodValidator(nextOfKinInputZodSchema),
    roleVerifier('user'),
    asyncHandler(nextOfKin.bind(userModules))
);

router.get(
    '/transactions',
    roleVerifier('user'),
    asyncHandler(getAllTransactions.bind(userModules))
);

router.get(
    '/transactions/:id',
    roleVerifier('user'),
    asyncHandler(getTransactionById.bind(userModules))
);

router.post(
    '/add-card',
    zodValidator(addCardInputZodSchema),
    roleVerifier('user'),
    asyncHandler(addCard.bind(userModules))
);

router.post(
    '/add-money/:cardId',
    zodValidator(addMoneyInputZodSchema),
    roleVerifier('user'),
    asyncHandler(addMoneyUsingCard.bind(userModules))
);

export const userRoutes = router;
