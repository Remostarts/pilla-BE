/* eslint-disable class-methods-use-this */
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import {
    HandleApiError,
    configs,
    errorNames,
    exclude,
    jwtHelpers,
    prisma,
} from '../../../../../shared';
import { CredentialSharedServices } from './credential.shared';
import { TUserLoginInput, TUserLoginResponse, TUserRegisterInput } from './credential.types';

const { findUserByEmail, findUserByToken, updateUserById, findUserById } = CredentialSharedServices;

export class CredentialServices {
    createUser = async (user: TUserRegisterInput): Promise<Omit<User, 'password'> | null> => {
        const userExists = await findUserByEmail(user.email);
        // user non existence check
        if (userExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already exists!'
            );
        }
        const phoneNumberExists = await prisma.profile.findFirst({
            where: {
                phoneNumber: user.phoneNumber,
            },
        });
        // phone number non existence check
        if (phoneNumberExists) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'phone number already exists!'
            );
        }
        const createdUser = await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                profile: {
                    create: {
                        phoneNumber: user.phoneNumber,
                    },
                },
            },
        });

        return exclude(createdUser, ['password']);
    };

    loginUser = async (loginInput: TUserLoginInput): Promise<TUserLoginResponse | null> => {
        // user existence check

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
        // email verification check
        const { isVerified } = userExists;

        // if (!isVerified) {
        //     throw new HandleApiError(
        //         errorNames.UNAUTHORIZED,
        //         httpStatus.UNAUTHORIZED,
        //         'Your account has not been verified, check your mail for a verification link or request account verification.'
        //     );
        // }
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

        return { accessToken, role, refreshToken, userExists };
    };

    async refreshAccessToken(
        refreshToken: string
    ): Promise<Omit<TUserLoginResponse, 'userExists'> | void> {
        const userExists = await findUserByToken(refreshToken);
        console.log('🌼 🔥🔥 CredentialServices 🔥🔥 refreshToken🌼', refreshToken);

        // refresh token reuse detection
        if (!userExists) {
            // refresh token niye asce but db te nai
            const decodedData = jwtHelpers.verifyToken(
                refreshToken,
                configs.jwtSecretRefresh as string
            );
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

            const newRefreshToken = jwtHelpers.createToken(
                payloadData,
                configs.jwtSecretRefresh as string,
                configs.jwtSecretRefreshExpired as string
            );

            await updateUserById(userExists.id, {
                refreshToken: [...newRefreshTokenArray, newRefreshToken],
            });
            return { accessToken, role, refreshToken: newRefreshToken };
        }
    }

    async logoutUser(refreshToken: string): Promise<void> {
        const userExists = await findUserByToken(refreshToken);
        if (!userExists) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
        }
        const newRefreshTokenArray = userExists.refreshToken.filter((rt) => rt !== refreshToken);
        await updateUserById(userExists.id, {
            refreshToken: newRefreshTokenArray,
        });
    }

    async verifyEmail(token: string): Promise<void> {
        const userExists = await findUserByToken(token);
        if (!userExists) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'user not found!');
        }
        if (userExists.isVerified) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'user already verified!'
            );
        }
        await updateUserById(userExists.id, {
            isVerified: true,
        });
    }
}
