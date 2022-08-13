import { Injectable } from '@nestjs/common';
import { getAddress } from 'ethers/lib/utils';

export function formatAddresses(addresses: string[]): string[] {
    return addresses.map((address) => formatAddress(address));
}

export function formatAddress(address?: string): string {
    if (!address || address.length === 0) return address;
    return getAddress(address);
}

@Injectable()
export class AddressFormatService {
    public execute(address: string): string {
        return formatAddress(address);
    }
}
