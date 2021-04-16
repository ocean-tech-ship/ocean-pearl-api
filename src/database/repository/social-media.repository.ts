import { SocialMediaInterface, SocialMedia } from "../model/social-media.model";
import { AbstractRepository } from "./abstract.repository";

export class SocialMediaRepository extends AbstractRepository<SocialMediaInterface> {

    constructor() {
        super(SocialMedia);
    }
}