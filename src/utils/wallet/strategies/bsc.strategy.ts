import { Injectable } from '@nestjs/common';
import { formatEther } from 'ethers/lib/utils';
import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { ChainedAddress } from '../models/chained-address.model';
import { WalletInfoStrategy } from '../interfaces/wallet-info-strategy.interface';
import { balanceOfAbi } from '../constants/balanceOfAbi.constant';
import { Contract, ethers } from 'ethers';

@Injectable()
export class BscStrategy implements WalletInfoStrategy {
    private readonly oceanContractAddress = '0xDCe07662CA8EbC241316a15B611c89711414Dd1a';
    private readonly polygonRpcUrl = 'https://bsc-dataseed.binance.org/';
    public readonly network = SupportedNetworksEnum.BSC;

    public canHandle(chainedAddress: ChainedAddress): boolean {
        return chainedAddress.network === this.network;
    }

    public async getBalance(address: string): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(this.polygonRpcUrl);

        const contract = new Contract(this.oceanContractAddress, balanceOfAbi, provider);
        const balance = formatEther(await contract.balanceOf(address));

        return parseInt(balance.toString(), 10);
    }
}
