import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { CryptoAddress } from '../../../database/schemas/crypto-address.schema';

export interface WalletInfoStrategy {
    network: SupportedNetworksEnum;
    canHandle(wallet: CryptoAddress): boolean;
    getBalance(address: string): Promise<number>;
}