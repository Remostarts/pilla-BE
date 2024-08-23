import { Router } from 'express';
import { asyncHandler, zodValidator } from '../../../../../shared';
import { CredentialModules } from './credential.modules';
import {
    forgetPasswordOtpSendZodSchema,
    forgetPasswordZodSchema,
    gettingStarteUserZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
    registerZodSchema,
} from './credential.validation';

const router = Router();
const credentialModules = new CredentialModules();
const {
    createPartialUser,
    createUser,
    loginUser,
    forgetPassword,
    forgetPasswordOtpSend,
    refreshAccessToken,
} = credentialModules.credentialControllers;

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
    '/forget-password-otp-send',
    zodValidator(forgetPasswordOtpSendZodSchema),
    asyncHandler(forgetPasswordOtpSend.bind(credentialModules))
);
router.post(
    '/forget-password',
    zodValidator(forgetPasswordZodSchema),
    asyncHandler(forgetPassword.bind(credentialModules))
);
router.get(
    '/refresh-token',
    zodValidator(refreshTokenZodSchema),
    asyncHandler(refreshAccessToken.bind(credentialModules))
);
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
