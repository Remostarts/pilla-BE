/* eslint-disable class-methods-use-this */
import { GettingStartedUser, User } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import httpStatus from 'http-status';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import {
    HandleApiError,
    configs,
    errorNames,
    // exclude,
    jwtHelpers,
    prisma,
} from '../../../../../shared';
import { MailOptions, sendMail } from '../../../../../shared/mail/mailService';
import { CredentialSharedServices } from './credential.shared';
import {
    TCreateAccountApiResponse,
    // TBankApiResponse,
    TEmailOtpSend,
    TForgetPasswordInput,
    TPartialUserRegisterInput,
    TResetPasswordInput,
    TResetTransactionPinInput,
    TUserLoginInput,
    TUserLoginResponse,
    TUserRegisterInput,
} from './credential.types';

const {
    findUserByEmail,
    findPartialUserByEmail,
    findUserByPhoneNumber,
    updateUserByEmail,
    // findUserByToken,
    findUserById,
    updateUserById,
    findUserByEmailAndRole,
} = CredentialSharedServices;

const getBankApiResponseMessage = (responseCode: string): string => {
    const errorMessages: Record<string, string> = {
        '00': 'Reserved Account Generated Successfully',
        '11': 'Error Completing Operation',
    };

    return (
        errorMessages[responseCode] || 'An unknown error occurred while creating the bank account.'
    );
};

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
                phone: user.phoneNumber,
            },
        });

        const mailOptions: MailOptions = {
            to: user.email,
            subject: 'Your OTP Code',
            template: 'sentOtp',
            context: {
                name: user.firstName,
                otp: code,
            },
        };

        try {
            await sendMail(mailOptions);
            console.log('Verification email sent successfully.');
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Optionally, handle the error (e.g., clean up the user created in case of failure)
        }

        return createdPartialUser;
    };

    createUser = async (user: TUserRegisterInput): Promise<object | null> => {
        console.log('🌼 🔥🔥 CredentialServices 🔥🔥 createUser= 🔥🔥 user🌼', user);

        const userExists = await findUserByEmail(user.email);
        const partialUser = await findPartialUserByEmail(user.email);
        console.log('🌼 🔥🔥 CredentialServices 🔥🔥 createUser= 🔥🔥 partialUser🌼', partialUser);

        // user non existence check
        if (userExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }

        if (!user.emailVerificationCode || !partialUser?.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code not found!'
            );
        }

        if ((partialUser?.emailVerificationExpiresAt as Date) < new Date()) {
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

        const { firstName, lastName, middleName, phone, email } = partialUser;
        const { password, role } = user;

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

        let createdUser = {} as User;
        // let bankApiResponse = {} as TCreateAccountApiResponse;

        await prisma.$transaction(async (tx) => {
            createdUser = await tx.user.create({
                data: {
                    email,
                    password,
                    firstName,
                    middleName,
                    lastName,
                    role,
                    phone,
                },
            });

            // const bankApiUrl = `${configs.bankUrl}/PiPCreateReservedAccountNumber`;
            // const bankApiHeaders = {
            //     'Client-Id': configs.clientId,
            //     'X-Auth-Signature': configs.XAuthSignature,
            // };
            // const bankApiBody = {
            //     account_name: createdUser?.firstName,
            //     bvn: '',
            // };

            // bankApiResponse = await axios.post(bankApiUrl, bankApiBody, {
            //     headers: bankApiHeaders,
            // });
            // console.log('bankApiResponse', bankApiResponse);
            // const { responseCode } = bankApiResponse.data;

            // if (responseCode !== '00') {
            //     const errorMessage = getBankApiResponseMessage(responseCode);
            //     throw new HandleApiError(
            //         errorNames.BAD_REQUEST,
            //         httpStatus.BAD_REQUEST,
            //         errorMessage
            //     );
            // }

            await tx.userAccount.create({
                data: {
                    accountNumber: '9977581536',
                    accountName: 'john don',
                    // accountNumber: bankApiResponse?.data.account_number,
                    // accountName: bankApiResponse?.data.account_name,
                    userId: createdUser?.id,
                },
            });
        });

        return createdUser;
    };

    loginUser = async (loginInput: TUserLoginInput): Promise<TUserLoginResponse | null> => {
        const userExists = await findUserByEmailAndRole(loginInput.email, loginInput.role);

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

        // const { isVerified } = userExists;

        // if (!isVerified) {
        //     throw new HandleApiError(
        //         errorNames.UNAUTHORIZED,
        //         httpStatus.UNAUTHORIZED,
        //         'Your account has not been verified'
        //     );
        // }

        const { email, role, firstName, id, profileImage } = userExists;
        const payloadData = {
            email,
            role,
            firstName,
            id,
            profileImage,
            iat: Math.floor(Date.now() / 1000),
        };
        const refreshTokenPayloadData = {
            email,
            iat: Math.floor(Date.now() / 1000),
        };
        const accessToken = jwtHelpers.createToken(
            payloadData,
            configs.jwtSecretAccess as string,
            configs.jwtSecretAccessExpired as string
        );

        const refreshToken = jwtHelpers.createToken(
            refreshTokenPayloadData,
            configs.jwtSecretRefresh as string,
            configs.jwtSecretRefreshExpired as string
        );

        // refresh token verification and save to db

        return { accessToken, refreshToken, userExists };
    };

    otpSend = async (input: TEmailOtpSend): Promise<Omit<User, 'password'> | null> => {
        const { email } = input;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
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

        const mailOptions: MailOptions = {
            to: email,
            subject: 'Your OTP Code',
            template: 'sentOtp',
            context: {
                name: user.firstName,
                otp: code,
            },
        };

        try {
            await sendMail(mailOptions);
            console.log('Verification email sent successfully.');
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Optionally, handle the error (e.g., clean up the user created in case of failure)
        }

        const expirationTime = 5 * 60 * 1000; // 5 minutes

        const updatedUser = await updateUserByEmail(email, {
            emailVerificationCode: code,
            emailVerificationExpiresAt: new Date(Date.now() + expirationTime),
        });

        return updatedUser;
    };

    forgetPassword = async (
        input: TForgetPasswordInput
    ): Promise<Omit<User, 'password'> | null> => {
        const { confirmNewPassword, newPassword, email, emailVerificationCode } = input;

        if (newPassword !== confirmNewPassword) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'new password and confirm password must be same'
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!user.emailVerificationCode) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code not found!'
            );
        }

        if ((user.emailVerificationExpiresAt as Date) < new Date()) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Verification code has expired!'
            );
        }

        if (user.emailVerificationCode !== emailVerificationCode) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Invalid email verification code'
            );
        }

        const updatedUser = await updateUserByEmail(email, { password: newPassword });

        return updatedUser;
    };

    changePassword = async (input: TResetPasswordInput, userID: string): Promise<object> => {
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

        const isPassCorrect = await prisma.user.validatePassword(
            user?.password as string,
            currentPassword
        );

        if (!isPassCorrect) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'Old password is incorrect!'
            );
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        const updatedUser = await updateUserById(userID, { password: newPassword });

        if (!updatedUser) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'failed to update password!'
            );
        }

        return {};
    };

    changeTransactionPin = async (
        input: TResetTransactionPinInput,
        userID: string
    ): Promise<object> => {
        const { currentTransactionPin, newTransactionPin, confirmNewTransactionPin } = input;

        if (newTransactionPin !== confirmNewTransactionPin) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'new Transaction pin and confirm Transaction pin must be same'
            );
        }

        const userAcc = await prisma.userAccount.findUnique({
            where: { userId: userID },
        });

        if (!userAcc) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user account not found !'
            );
        }

        if (userAcc.transactionPin !== currentTransactionPin) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'Invalid current transaction pin!'
            );
        }

        // const updatedUser = await updateUserById(userID, { password: newPassword });
        const updatedUser = await prisma.userAccount.update({
            where: { userId: userID },
            data: { transactionPin: newTransactionPin },
        });

        if (!updatedUser) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'failed to update transaction pin!'
            );
        }

        return {};
    };

    async refreshAccessToken(
        refreshToken: string
    ): Promise<Omit<TUserLoginResponse, 'userExists'> | void> {
        // console.log('🌼 🔥🔥 CredentialServices 🔥🔥 userExists🌼', userExists);
        const decodedData = jwtHelpers.verifyToken(
            refreshToken,
            configs.jwtSecretRefresh as string
        );
        // console.log('🌼 🔥🔥 CredentialServices 🔥🔥 decoded🌼', decoded);
        const userExists = await findUserByEmail(decodedData.email as string);

        // refresh token reuse detection
        if (!userExists) {
            // refresh token niye asce but db te nai

            if (decodedData) {
                const hackedUser = await findUserById(decodedData.id as string);
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            }
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid token !'
            );
        }
        let newRefreshTokenArray = [] as string[] | [];
        if (userExists) {
            // refresh token niye asce and db teo ache

            // steps 1. existing refresh token array theke ei refresh token ta remove kore dibo
            newRefreshTokenArray = userExists.refreshToken.filter((rt) => rt !== refreshToken);

            const verifyToken = jwtHelpers.verifyTokenWithError(
                refreshToken,
                configs.jwtSecretRefresh as string
            );
            if (verifyToken.err) {
                // refresh token expired
                await updateUserById(userExists.id, {
                    refreshToken: newRefreshTokenArray,
                });
                throw new JsonWebTokenError('refresh token expired. login again!');
            }
            if ((verifyToken.decoded as JwtPayload)?.email !== userExists.email) {
                throw new HandleApiError(
                    errorNames.UNAUTHORIZED,
                    httpStatus.UNAUTHORIZED,
                    'something wrong with token!'
                );
            }

            // refresh token valid
            const { email, role, firstName, profileImage, id } = userExists;
            const payloadData = {
                email,
                role,
                firstName,
                id,
                profileImage,

                iat: Math.floor(Date.now() / 1000),
            };
            const refreshTokenPayloadData = {
                email,
                iat: Math.floor(Date.now() / 1000),
            };
            const accessToken = jwtHelpers.createToken(
                payloadData,
                configs.jwtSecretAccess as string,
                configs.jwtSecretAccessExpired as string
            );

            const newRefreshToken = jwtHelpers.createToken(
                refreshTokenPayloadData,
                configs.jwtSecretRefresh as string,
                configs.jwtSecretRefreshExpired as string
            );

            await updateUserById(userExists.id, {
                refreshToken: [...newRefreshTokenArray, newRefreshToken],
            });
            return { accessToken, refreshToken: newRefreshToken };
        }
    }

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
