import { BadRequestException } from '@nestjs/common';
import { EXCEPTION_COMMON } from '../constants/exception';

export const imageFileFilter = (req, file, callback) => {
  if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
    return callback(
      new BadRequestException(EXCEPTION_COMMON.FILE_TYPE_NOT_ALLOWED),
      false,
    );
  }

  callback(null, true);
};
