/* eslint-disable class-methods-use-this */
import { GettingStartedUser, User } from '@prisma/client';
import crypto from 'crypto';
import httpStatus from 'http-status';
import {
    HandleApiError,
    configs,
    errorNames,
    exclude,
    jwtHelpers,
    prisma,
} from '../../../../../shared';
import { CustomerType } from '../../../../../shared/enums';
import { CredentialSharedServices } from './credential.shared';
import {
    TForgetPasswordInput,
    TPartialUser,
    TPartialUserRegisterInput,
    TUserLoginInput,
    TUserLoginResponse,
    TUserRegisterInput,
} from './credential.types';

const { findUserByEmail, findPartialUserByEmail, findUserByPhoneNumber, updateUserById } =
    CredentialSharedServices;

export class CredentialServices {
    createPartialUser = async (
        user: TPartialUserRegisterInput
    ): Promise<GettingStartedUser | null> => {
        const userExists = await findUserByEmail(user.email);

        if (userExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }

        const phoneNumberExists = await findUserByPhoneNumber(user.phoneNumber);

        if (phoneNumberExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'phone number already exists!'
            );
        }

        const code = crypto.randomInt(100000, 999999).toString();

        if (!code) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Error while generating code!'
            );
        }

        const expirationTime = 5 * 60 * 1000; // 5 minutes

        const createdPartialUser = await prisma.gettingStartedUser.create({
            data: {
                email: user.email,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                emailVerificationCode: code,
                emailVerificationExpiresAt: new Date(Date.now() + expirationTime),
                // phoneVerificationCode: code,
            },
        });

        return createdPartialUser;
    };

    createUser = async (user: TUserRegisterInput): Promise<Omit<User, 'password'> | null> => {
        const userExists = await findUserByEmail(user.email);
        const partialUser = await findPartialUserByEmail(user.email);
        // user non existence check
        if (userExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }

        if (!user.emailVerificationCode || !partialUser?.emailVerificationExpiresAt) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code not found!'
            );
        }

        if (partialUser?.emailVerificationExpiresAt < new Date()) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code has expired!'
            );
        }

        if (user.emailVerificationCode !== partialUser?.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Invalid email verification code'
            );
        }

        const { firstName, lastName, middleName, phone, email } =
            partialUser as unknown as TPartialUser;
        const { password, customerType } = user as unknown as TUserRegisterInput;

        const createdUser = await prisma.user.create({
            data: {
                email,
                password,
                firstName,
                middleName,
                lastName,
                customerType: customerType as CustomerType,
                phone,
                isVerified: true,
            },
        });

        const deleteGettingStartedUser = await prisma.gettingStartedUser.delete({
            where: {
                email: user.email,
            },
        });

        if (!deleteGettingStartedUser) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Failed to delete partial user'
            );
        }

        return exclude(createdUser, ['password']);
    };

    loginUser = async (loginInput: TUserLoginInput): Promise<TUserLoginResponse | null> => {
        const userExists = await findUserByEmail(loginInput.email);

        if (!userExists) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }
        // password validation check
        const isPasswordValid = await prisma.user.validatePassword(
            userExists.password as string,
            loginInput.password
        );

        if (!isPasswordValid) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid email or password !'
            );
        }

        const { isVerified } = userExists;

        if (!isVerified) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Your account has not been verified'
            );
        }
        const { email, role, firstName, lastName, id } = userExists;
        const payloadData = {
            email,
            role,
            firstName,
            lastName,
            id,
            iat: Math.floor(Date.now() / 1000),
        };
        const accessToken = jwtHelpers.createToken(
            payloadData,
            configs.jwtSecretAccess as string,
            configs.jwtSecretAccessExpired as string
        );

        const refreshToken = jwtHelpers.createToken(
            payloadData,
            configs.jwtSecretRefresh as string,
            configs.jwtSecretRefreshExpired as string
        );

        // refresh token verification and save to db

        return { role, accessToken, refreshToken, userExists };
    };

    forgetPassword = async (
        input: TForgetPasswordInput,
        userID: string
    ): Promise<Omit<User, 'password'> | null> => {
        const { currentPassword, confirmNewPassword, newPassword } = input;

        if (newPassword !== confirmNewPassword) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'new passowrd and confirm password must be same'
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userID },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        const isPasswordValid = await prisma.user.validatePassword(
            user.password as string,
            currentPassword
        );

        if (!isPasswordValid) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid current password!'
            );
        }

        const updatedUser = await updateUserById(userID, { password: newPassword });

        return updatedUser;
    };

    // async refreshAccessToken(
    //     refreshToken: string
    // ): Promise<Omit<TUserLoginResponse, 'userExists'> | void> {
    //     const userExists = await findUserByToken(refreshToken);
    //     console.log('🌼 🔥🔥 CredentialServices 🔥🔥 refreshToken🌼', refreshToken);

    //     // refresh token reuse detection
    //     if (!userExists) {
    //         // refresh token niye asce but db te nai
    //         const decodedData = jwtHelpers.verifyToken(
    //             refreshToken,
    //             configs.jwtSecretRefresh as string
    //         );
    //         if (decodedData) {
    //             const hackedUser = await findUserById(decodedData.id as string);
    //             if (hackedUser) {
    //                 hackedUser.refreshToken = [];
    //                 await hackedUser.save();
    //             }
    //         }
    //         throw new HandleApiError(
    //             errorNames.UNAUTHORIZED,
    //             httpStatus.UNAUTHORIZED,
    //             'invalid token !'
    //         );
    //     }
    //     let newRefreshTokenArray = [] as string[] | [];
    //     if (userExists) {
    //         // refresh token niye asce and db teo ache

    //         // steps 1. existing refresh token array theke ei refresh token ta remove kore dibo
    //         newRefreshTokenArray = userExists.refreshToken.filter((rt) => rt !== refreshToken);

    //         const verifyToken = jwtHelpers.verifyTokenWithError(
    //             refreshToken,
    //             configs.jwtSecretRefresh as string
    //         );
    //         if (verifyToken.err) {
    //             // refresh token expired
    //             await updateUserById(userExists.id, {
    //                 refreshToken: newRefreshTokenArray,
    //             });
    //             throw new JsonWebTokenError('refresh token expired. login again!');
    //         }
    //         if ((verifyToken.decoded as JwtPayload)?.email !== userExists.email) {
    //             throw new HandleApiError(
    //                 errorNames.UNAUTHORIZED,
    //                 httpStatus.UNAUTHORIZED,
    //                 'something wrong with token!'
    //             );
    //         }

    //         // refresh token valid
    //         const { email, role, firstName, lastName, id } = userExists;
    //         const payloadData = {
    //             email,
    //             role,
    //             firstName,
    //             lastName,
    //             id,
    //             iat: Math.floor(Date.now() / 1000),
    //         };
    //         const accessToken = jwtHelpers.createToken(
    //             payloadData,
    //             configs.jwtSecretAccess as string,
    //             configs.jwtSecretAccessExpired as string
    //         );

    //         const newRefreshToken = jwtHelpers.createToken(
    //             payloadData,
    //             configs.jwtSecretRefresh as string,
    //             configs.jwtSecretRefreshExpired as string
    //         );

    //         await updateUserById(userExists.id, {
    //             refreshToken: [...newRefreshTokenArray, newRefreshToken],
    //         });
    //         return { accessToken, role, refreshToken: newRefreshToken };
    //     }
    // }

    // async logoutUser(refreshToken: string): Promise<void> {
    //     const userExists = await findUserByToken(refreshToken);
    //     if (!userExists) {
    //         throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
    //     }
    //     const newRefreshTokenArray = userExists.refreshToken.filter((rt) => rt !== refreshToken);
    //     await updateUserById(userExists.id, {
    //         refreshToken: newRefreshTokenArray,
    //     });
    // }

    // async verifyEmail(token: string): Promise<void> {
    //     const userExists = await findUserByToken(token);
    //     if (!userExists) {
    //         throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
    //     }
    //     if (userExists.isVerified) {
    //         throw new HandleApiError(
    //             errorNames.CONFLICT,
    //             httpStatus.CONFLICT,
    //             'user already verified!'
    //         );
    //     }
    //     await updateUserById(userExists.id, {
    //         isVerified: true,
    //     });
    // }
}
