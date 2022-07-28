import { Injectable } from '@nestjs/common';
import { formatEther } from 'ethers/lib/utils';
import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { CryptoAddress } from '../../../database/schemas/crypto-address.schema';
import { WalletInfoStrategy } from '../interfaces/wallet-info-strategy.interface';
import { balanceOfAbi } from '../constants/balanceOfAbi.constant';
import { Contract, ethers } from 'ethers';

@Injectable()
export class PolygonStrategy implements WalletInfoStrategy {
    private readonly oceanContractAddress = '0x282d8efCe846A88B159800bd4130ad77443Fa1A1';
    private readonly polygonRpcUrl = 'https://polygon-rpc.com';
    public readonly network = SupportedNetworksEnum.Polygon;

    public canHandle(wallet: CryptoAddress): boolean {
        return wallet.network === this.network;
    }

    public async getBalance(address: string): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(this.polygonRpcUrl);

        const contract = new Contract(this.oceanContractAddress, balanceOfAbi, provider);
        const balance = formatEther(await contract.balanceOf(address));

        return parseInt(balance.toString(), 10);
    }
}
