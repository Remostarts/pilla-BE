import { Profile, User } from '@prisma/client';

export type TUserRegisterInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
};

export type TUserLoginInput = {
    email: string;
    password: string;
};

export type TUserWithProfile = User & {
    profile?: Profile | null;
};

export type TUserLoginResponse = {
    userExists: User;
    accessToken: string;
    refreshToken: string;
    role: string;
};
export type TCookies = {
    refreshToken: string;
    accessToken?: string;
};
export type TAccessToken = {
    accessToken: string;
};
export type TRefreshToken = {
    refreshToken: string;
};
export type TTokens = TAccessToken & TRefreshToken;
