import { Router } from 'express';
import { asyncHandler, roleVerifier, zodValidator } from '../../../../../shared';
import { CredentialModules } from './credential.modules';
import {
    forgetPasswordZodSchema,
    gettingStarteUserZodSchema,
    loginZodSchema,
    registerZodSchema,
} from './credential.validation';

const router = Router();
const credentialModules = new CredentialModules();
const { createPartialUser, createUser, loginUser, forgetPassword } =
    credentialModules.credentialControllers;

router.post(
    '/create-partial-user',
    zodValidator(gettingStarteUserZodSchema),
    asyncHandler(createPartialUser.bind(credentialModules))
);
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
router.post(
    '/forget-password',
    zodValidator(forgetPasswordZodSchema),
    roleVerifier('user', 'admin', 'super_admin'),
    asyncHandler(forgetPassword.bind(credentialModules))
);
// router.get(
//     '/refresh-token',
//     zodValidator(refreshTokenZodSchema),
//     asyncHandler(refreshAccessToken.bind(credentialModules))
// );
// router.post(
//     '/verify-email',
//     zodValidator(verifyEmailZodSchema),
//     asyncHandler(verifyEmail.bind(credentialModules))
// );
// router.get(
//     '/logout',
//     zodValidator(refreshTokenZodSchema),
//     asyncHandler(logoutUser.bind(credentialModules))
// );

export const credentialRoutes = router;
