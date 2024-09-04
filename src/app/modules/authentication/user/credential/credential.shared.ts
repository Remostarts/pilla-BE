import { User } from '@prisma/client';
import { prisma, UserRole } from '../../../../../shared';
import { TPartialUser, TUserWithProfile } from './credential.types';

export class CredentialSharedServices {
    static async findUserByEmail(email: string): Promise<TUserWithProfile | null> {
        return prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }

    static async findUserByEmailAndRole(
        email: string,
        role: UserRole = UserRole.PERSONAL
    ): Promise<TUserWithProfile | null> {
        return prisma.user.findUnique({
            where: { email, role },

            include: { profile: true },
        });
    }

    static async findPartialUserByEmail(email: string): Promise<TPartialUser | null> {
        return prisma.gettingStartedUser.findFirst({
            where: { email },
        }) as Promise<TPartialUser | null>;
    }

    static async findUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    static async findUserByToken(token: string) {
        const user = await prisma.user.findFirst({
            where: {
                refreshToken: {
                    has: token,
                },
            },
        });

        return user;
    }
    // static async findUserByToken(token: string): Promise<User | null> {
    //     return prisma.user.findFirst({
    //         where: {
    //             refreshToken: {
    //                 has: token,
    //             },
    //         },
    //     });
    // }

    static async findUserByPhoneNumber(phone: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                phone,
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

    static async updateUserByEmail(
        email: string,
        data: Record<string, unknown>
    ): Promise<User | null> {
        return prisma.user.update({
            where: {
                email,
            },
            data,
        });
    }
}
