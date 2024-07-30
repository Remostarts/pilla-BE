import { Router } from 'express';
import { asyncHandler, zodValidator } from '../../../../../shared';
import { CredentialModules } from './credential.modules';
import {
    loginZodSchema,
    refreshTokenZodSchema,
    registerZodSchema,
    verifyEmailZodSchema,
} from './credential.validation';

const router = Router();
const credentialModules = new CredentialModules();
const { createUser, loginUser, refreshAccessToken, logoutUser, verifyEmail } =
    credentialModules.credentialControllers;

router.post(
    '/register',
    zodValidator(registerZodSchema),
    asyncHandler(createUser.bind(credentialModules))
);
router.post(
    '/login',
    zodValidator(loginZodSchema),
    asyncHandler(loginUser.bind(credentialModules))
);
router.get(
    '/refresh-token',
    zodValidator(refreshTokenZodSchema),
    asyncHandler(refreshAccessToken.bind(credentialModules))
);
router.post(
    '/verify-email',
    zodValidator(verifyEmailZodSchema),
    asyncHandler(verifyEmail.bind(credentialModules))
);
router.get(
    '/logout',
    zodValidator(refreshTokenZodSchema),
    asyncHandler(logoutUser.bind(credentialModules))
);

export const credentialRoutes = router;
