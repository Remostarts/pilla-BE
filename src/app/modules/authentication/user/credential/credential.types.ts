import { GettingStartedUser, Profile, User } from '@prisma/client';

export type TPartialUserRegisterInput = {
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
};

export type TUserRegisterInput = {
    email: string;
    password: string;
    confirmPasswords: string;
    emailVerificationCode: string;
    customerType: string;
};

export type TForgetPasswordInput = {
    email: string;
    emailVerificationCode: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type TEmailOtpSend = {
    email: string;
};

export type TUserLoginInput = {
    email: string;
    password: string;
};

export type TPartialUser = GettingStartedUser;

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
