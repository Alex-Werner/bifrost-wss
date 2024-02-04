import { randomStringForEntropy } from '@stablelib/random';
export const generateNonce = () => {
    const nonce = randomStringForEntropy(96);
    if (!nonce || nonce.length < 8) {
        throw new Error('Error during nonce creation.');
    }
    return nonce;
};
