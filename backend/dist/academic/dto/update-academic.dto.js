"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAcademicDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_academic_dto_1 = require("./create-academic.dto");
class UpdateAcademicDto extends (0, mapped_types_1.PartialType)(create_academic_dto_1.CreateAcademicDto) {
}
exports.UpdateAcademicDto = UpdateAcademicDto;
//# sourceMappingURL=update-academic.dto.js.map