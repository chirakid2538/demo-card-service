"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertError = void 0;
const convertError = (init, errors) => {
    return errors.reduce((prev, e) => {
        if (e?.children?.length > 0) {
            prev[e.property] = (0, exports.convertError)({}, e.children);
        }
        else {
            prev[e.property] = e.constraints;
        }
        return prev;
    }, init);
};
exports.convertError = convertError;
//# sourceMappingURL=class-validator.util.js.map