import { HttpException } from '@nestjs/common';

export class I18nHttpException extends HttpException {
    constructor(exception: HttpException, i18n: string) {
        super(
            Object.assign(exception.getResponse(), { i18n }),
            exception.getStatus(),
        );
    }
}
