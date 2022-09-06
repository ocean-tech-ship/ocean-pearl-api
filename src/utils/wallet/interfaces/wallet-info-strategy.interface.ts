import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { ChainedAddress } from '../models/chained-address.model';

export interface WalletInfoStrategy {
    network: SupportedNetworksEnum;
    canHandle(chainedAddress: ChainedAddress): boolean;
    getBalance(address: string): Promise<number>;
}
