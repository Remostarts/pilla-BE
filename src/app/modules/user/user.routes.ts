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
    pinInputZodSchema,
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
    getPersonalDashboardData,
    setTransactionPin,
} = userModules.userControllers;

router.post(
    '/verify-bvn',
    zodValidator(bnvVerificationInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(bvnVerification.bind(userModules))
);

router.post(
    '/verify-id',
    zodValidator(idVerificationInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(idVerification.bind(userModules))
);

router.post(
    '/verify-address',
    zodValidator(proofOfAddressInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(proofOfAddress.bind(userModules))
);

router.post(
    '/add-next-of-kin',
    zodValidator(nextOfKinInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(nextOfKin.bind(userModules))
);

router.post(
    '/setTransactionPin',
    zodValidator(pinInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(setTransactionPin.bind(userModules))
);

router.get(
    '/transactions',
    roleVerifier('personal', 'business'),
    asyncHandler(getAllTransactions.bind(userModules))
);

router.get(
    '/transactions/:id',
    roleVerifier('personal', 'business'),
    asyncHandler(getTransactionById.bind(userModules))
);

router.post(
    '/add-card',
    zodValidator(addCardInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(addCard.bind(userModules))
);

router.post(
    '/add-money/:cardId',
    zodValidator(addMoneyInputZodSchema),
    roleVerifier('personal', 'business'),
    asyncHandler(addMoneyUsingCard.bind(userModules))
);

router.get(
    '/getPersonalDashboardData',
    roleVerifier('personal'),
    asyncHandler(getPersonalDashboardData.bind(userModules))
);

export const userRoutes = router;
