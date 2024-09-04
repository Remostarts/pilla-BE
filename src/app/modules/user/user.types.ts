import { AddressProofDocType, IdVerificationDocType } from '@prisma/client';

export type TBvnVerificationInput = {
    bvn: string;
    gender: string;
    dateOfBirth: Date;
};

export type TIdVerificationInput = {
    documentType: IdVerificationDocType;
    idNumber: string;
    image: string;
    nin: string;
};

export type TProofOfAddressInput = {
    address: string;
    state: string;
    localGovernment: string;
    city: string;
    documentType: AddressProofDocType;
    image: string;
};

export type TNextOfKinInput = {
    firstName: string;
    lastName: string;
    gender: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
    localGovernment: string;
    state: string;
    city: string;
};

export type TAddCardInput = {
    cardNumber: string;
    expiryDate: string;
    cardHolderName: string;
    cvv: string;
};

export type TAddMoneyInput = {
    amount: number;
};

export type TTransactionPinInput = {
    pin: string;
    confirmPin: string;
};
