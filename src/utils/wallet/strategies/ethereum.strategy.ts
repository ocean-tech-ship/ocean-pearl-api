import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { ChainedAddress } from '../models/chained-address.model';
import { balanceOfAbi } from '../constants/balanceOfAbi.constant';
import { WalletInfoStrategy } from '../interfaces/wallet-info-strategy.interface';

@Injectable()
export class EthereumStrategy implements WalletInfoStrategy {
    private readonly oceanContractAddress = '0x967da4048cD07aB37855c090aAF366e4ce1b9F48';
    public readonly network = SupportedNetworksEnum.Ethereum;

    public canHandle(chainedAddress: ChainedAddress): boolean {
        return chainedAddress.network === this.network;
    }

    public async getBalance(address: string): Promise<number> {
        const provider = ethers.getDefaultProvider();

        const contract = new Contract(this.oceanContractAddress, balanceOfAbi, provider);
        const balance = formatEther(await contract.balanceOf(address));

        return parseInt(balance.toString(), 10);
    }
}
