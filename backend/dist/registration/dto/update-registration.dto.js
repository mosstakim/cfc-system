"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRegistrationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_registration_dto_1 = require("./create-registration.dto");
class UpdateRegistrationDto extends (0, mapped_types_1.PartialType)(create_registration_dto_1.CreateRegistrationDto) {
    status;
}
exports.UpdateRegistrationDto = UpdateRegistrationDto;
//# sourceMappingURL=update-registration.dto.js.map