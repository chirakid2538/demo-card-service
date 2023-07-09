import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { convertError, hash } from './common/utils';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return works', () => {
      expect(appController.getHello()).toBe('works');
    });
  });

  describe('utils.hash', () => {
    it('encode return string', async () => {
      const hashed = await hash.encode('123456789');
      expect(typeof hashed).toBe('string');
    });
    it('compare is valid return true', async () => {
      const hashed = await hash.encode('123456789');
      const isCorrect = await hash.compare('123456789', hashed);
      expect(isCorrect).toBe(true);
    });
    it('compare is invalid return false', async () => {
      const hashed = await hash.encode('123456789');
      const isCorrect = await hash.compare(')#421wdf32', hashed);
      expect(isCorrect).toBe(false);
    });
  });

  describe('utils.handle-error', () => {
    it('convertError return object', async () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: {
            min: 'page must not be less than 1',
            isInt: 'page must be an integer number',
          },
        },
        {
          property: 'address',
          children: [
            {
              property: 'address',
              constraints: {
                isString: 'address must not be string',
              },
            },
            {
              property: 'phone',
              constraints: {
                isString: 'phone must not be string',
              },
            },
          ],
        },
      ];
      const expected = {
        name: {
          min: 'page must not be less than 1',
          isInt: 'page must be an integer number',
        },
        address: {
          address: { isString: 'address must not be string' },
          phone: { isString: 'phone must not be string' },
        },
      };
      expect(convertError({}, errors)).toMatchObject(expected);
    });
  });
});
