import { Injectable } from '@nestjs/common';
import { getAddress } from 'ethers/lib/utils';

@Injectable()
export class AddressFormatService {
    public execute(address: string): string {
        return getAddress(address);
    }
}
