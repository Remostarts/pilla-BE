import { Profile, User } from '@prisma/client';
import { prisma } from '../../../../../shared';
import { TUserWithProfile } from './credential.types';

export class CredentialSharedServices {
    static async findUserByEmail(email: string): Promise<TUserWithProfile | null> {
        return prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }

    static async findUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    static async findUserByToken(token: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {
                refreshToken: {
                    has: token,
                },
            },
        });
    }

    static async findProfileByPhoneNumber(phoneNumber: string): Promise<Profile | null> {
        return prisma.profile.findFirst({
            where: {
                phoneNumber,
            },
        });
    }

    static async updateUserById(id: string, data: Record<string, unknown>): Promise<User | null> {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }
}
