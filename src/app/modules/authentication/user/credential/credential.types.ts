import { GettingStartedUser, Profile, User } from '@prisma/client';
import { UserRole } from '../../../../../shared';

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
    role: UserRole;
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
    role?: UserRole;
};

export type TPartialUser = GettingStartedUser;

export type TUserWithProfile = User & {
    profile?: Profile | null;
};

export type TUserLoginResponse = {
    userExists: User;
    accessToken: string;
    refreshToken: string;
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

export type TBankApiResponse = {
    account_number: string;
    account_name: string;
    bvn: string;
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
};
