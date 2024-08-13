/* eslint-disable class-methods-use-this */
import { BankVerification, IdentityVerification, NextOfKin, ProofOfAddress } from '@prisma/client';
import httpStatus from 'http-status';
import { errorNames, HandleApiError, prisma } from '../../../shared';
import {
    TBvnVerificationInput,
    TIdVerificationInput,
    TNextOfKinInput,
    TProofOfAddressInput,
} from './user.types';

export class UserServices {
    async bvnVerification(
        input: TBvnVerificationInput,
        userId: string
    ): Promise<BankVerification | null> {
        const { bvn, gender, dateOfBirth } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                identityVerification: true,
                nextOfKin: true,
                proofOfAddress: true,
                bankVerification: true,
            },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!bvn || !gender || !dateOfBirth) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        // TODO: BVN Verification Logic

        const bvnDetails = await prisma.bankVerification.create({
            data: {
                bvn,
                gender,
                dateOfBirth,
                userId,
                isVerified: true,
            },
        });

        if (
            user.identityVerification?.isVerified &&
            user.nextOfKin?.isVerified &&
            user.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return bvnDetails;
    }

    async idVerification(
        input: TIdVerificationInput,
        userId: string
    ): Promise<IdentityVerification | null> {
        const { documentType, image, idNumber } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                identityVerification: true,
                nextOfKin: true,
                proofOfAddress: true,
                bankVerification: true,
            },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!documentType || !idNumber || !image) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        // TODO: ID Verification Logic

        const idDetails = await prisma.identityVerification.create({
            data: {
                idNumber,
                image,
                documentType,
                userId,
                isVerified: true,
            },
        });

        if (
            user.bankVerification?.isVerified &&
            user.nextOfKin?.isVerified &&
            user.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return idDetails;
    }

    async proofOfAddress(
        input: TProofOfAddressInput,
        userId: string
    ): Promise<ProofOfAddress | null> {
        const { address, state, localGovernment, city, documentType, image } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                identityVerification: true,
                nextOfKin: true,
                proofOfAddress: true,
                bankVerification: true,
            },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!address || !state || !localGovernment || !city || !documentType || !image) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        // TODO: Address Verification Logic

        const addressDetails = await prisma.proofOfAddress.create({
            data: {
                address,
                state,
                localGovernment,
                city,
                documentType,
                image,
                userId,
                isVerified: true,
            },
        });

        if (
            user.bankVerification?.isVerified &&
            user.nextOfKin?.isVerified &&
            user.identityVerification?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return addressDetails;
    }

    async nextOfKin(input: TNextOfKinInput, userId: string): Promise<NextOfKin | null> {
        const { firstName, lastName, gender, relationship, phone, email, address } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                identityVerification: true,
                nextOfKin: true,
                proofOfAddress: true,
                bankVerification: true,
            },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!firstName || !lastName || !gender || !relationship || !phone || !email || !address) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        const kinDetails = await prisma.nextOfKin.create({
            data: {
                firstName,
                lastName,
                gender,
                relationship,
                phone,
                email,
                address,
                userId,
                isVerified: true,
            },
        });

        if (
            user.bankVerification?.isVerified &&
            user.identityVerification?.isVerified &&
            user.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return kinDetails;
    }
}
