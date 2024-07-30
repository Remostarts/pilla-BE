import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '@prisma/client';
import { HandleApiError, cookieOptions, errorNames, responseHandler } from '../../../../../shared';
import { CredentialServices } from './credential.services';
import { CredentialSharedServices } from './credential.shared';
import {
    TCookies,
    TRefreshToken,
    TUserLoginInput,
    TUserLoginResponse,
    TUserRegisterInput,
} from './credential.types';

const { updateUserById } = CredentialSharedServices;

export class CredentialControllers {
    constructor(readonly credentialServices: CredentialServices) {}

    async createUser(req: Request, res: Response): Promise<void> {
        const result = await this.credentialServices.createUser(req.body as TUserRegisterInput);

        responseHandler<Omit<User, 'password'>>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'user created successfully!',
            data: result,
        });
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        const { cookies } = req as { cookies: TCookies };
        const result = await this.credentialServices.loginUser(req.body as TUserLoginInput);
        const { refreshToken, userExists, ...rest } = result as TUserLoginResponse;

        let newRefreshTokenArray = userExists.refreshToken as string[] | [];
        if (cookies?.refreshToken) {
            newRefreshTokenArray = newRefreshTokenArray.filter(
                (rt) => rt !== cookies?.refreshToken
            );
            const foundToken = userExists.refreshToken?.find((rt) => rt === cookies?.refreshToken);
            if (!foundToken) {
                newRefreshTokenArray = [];
                res.clearCookie('refreshToken', cookieOptions);
            }
        }
        newRefreshTokenArray = [...newRefreshTokenArray, refreshToken];

        await updateUserById(userExists.id, {
            refreshToken: newRefreshTokenArray,
        });

        res.cookie('refreshToken', refreshToken, cookieOptions);

        responseHandler<Omit<Omit<TUserLoginResponse, 'userExists'>, 'refreshToken'>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'user logged in successfully!',
            data: rest,
        });
    }

    async refreshAccessToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.cookies as TRefreshToken;
        if (!refreshToken) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid token!'
            );
        }
        res.clearCookie('refreshToken', cookieOptions);
        const result = await this.credentialServices.refreshAccessToken(refreshToken);
        const { refreshToken: newRefreshToken, ...rest } = result as TUserLoginResponse;
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        responseHandler<Omit<TUserLoginResponse, 'userExists' | 'refreshToken'>>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'token refreshed successfully!',
            data: rest,
        });
    }

    async logoutUser(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.cookies as TRefreshToken;
        if (!refreshToken) {
            throw new HandleApiError(
                errorNames.UNAUTHORIZED,
                httpStatus.UNAUTHORIZED,
                'invalid token!'
            );
        }
        res.clearCookie('refreshToken', cookieOptions);
        await this.credentialServices.logoutUser(refreshToken);

        responseHandler<object>(res, {
            statusCode: httpStatus.NO_CONTENT,
            success: true,
            message: 'user logged out successfully!',
            data: {},
        });
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        const { token } = req.body as { token: string };
        await this.credentialServices.verifyEmail(token);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'email verified successfully!',
            data: {},
        });
    }
}
