"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const utils_1 = require("@/common/utils");
const exception_1 = require("./common/constants/exception");
const PORT = process.env.PORT || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
            const responseError = (0, utils_1.convertError)({}, errors);
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: exception_1.EXCEPTION_COMMON.VALIDATE_FAILED,
                errors: responseError,
            });
        },
    }));
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map