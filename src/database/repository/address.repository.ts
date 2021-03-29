import { AddressInterface, Address } from "../model/address.model";
import { AbstractRepository } from "./abstract.repository";

export class AddressRepository extends AbstractRepository<AddressInterface> {

    constructor() {
        super(Address);
    }
}
