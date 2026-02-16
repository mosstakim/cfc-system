"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFormationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_formation_dto_1 = require("./create-formation.dto");
class UpdateFormationDto extends (0, mapped_types_1.PartialType)(create_formation_dto_1.CreateFormationDto) {
}
exports.UpdateFormationDto = UpdateFormationDto;
//# sourceMappingURL=update-formation.dto.js.map