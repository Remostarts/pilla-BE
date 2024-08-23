/* eslint-disable class-methods-use-this */
import {
    BankVerification,
    Card,
    IdentityVerification,
    NextOfKin,
    ProofOfAddress,
    Transaction,
} from '@prisma/client';
import httpStatus from 'http-status';
import { errorNames, HandleApiError, prisma } from '../../../shared';
import {
    TAddCardInput,
    TAddMoneyInput,
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

    async getAllTransactions(userId: string): Promise<Transaction[]> {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
        });

        if (!transactions) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'No transactions found for this user'
            );
        }

        return transactions;
    }

    async getTransactionById(transactionId: string, userId: string): Promise<Transaction | null> {
        const transaction = await prisma.transaction.findFirst({
            where: { id: transactionId, userId },
        });

        if (!transaction) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'Transaction not found'
            );
        }

        return transaction;
    }

    async addCard(input: TAddCardInput, userId: string): Promise<Card | null> {
        const { cardNumber, expiryDate, cardHolderName, cvv } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'User not found');
        }

        // logic to validate card details

        const card = await prisma.card.create({
            data: {
                cardNumber,
                expiryDate,
                cardHolderName,
                cvv,
                userId,
            },
        });

        return card;
    }

    async addMoneyUsingCard(
        userId: string,
        cardId: string,
        input: TAddMoneyInput
    ): Promise<Transaction> {
        const { amount } = input;

        const card = await prisma.card.findFirst({
            where: {
                id: cardId,
                userId,
            },
        });

        if (!card) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'Card not found');
        }

        // Add logic to process the payment using the card via a payment gateway

        // If the payment is successful, create a transaction record

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const presentAmount = user?.amount;
        const newAmt = (presentAmount as number) + amount;

        const addAmt = await prisma.user.update({
            where: { id: userId },
            data: {
                amount: newAmt,
            },
        });

        console.log(addAmt);

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                userId,
                transactionType: 'Credit',
                status: 'Success',
                accountName: 'ABC',
                bankName: 'ABC',
                bankAccount: '1234',
                narration: 'Card',
                sessionId: '5552684102526652', // generate session id id
                transactionId: '541241284546681222', // generate transaction id
            },
        });

        return transaction;
    }
}
