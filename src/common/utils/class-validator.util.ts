import { ValidationError } from '@nestjs/common';

export const convertError = (init, errors: ValidationError[]) => {
  return errors.reduce((prev, e) => {
    if (e?.children?.length > 0) {
      prev[e.property] = convertError({}, e.children);
    } else {
      prev[e.property] = e.constraints;
    }
    return prev;
  }, init);
};
