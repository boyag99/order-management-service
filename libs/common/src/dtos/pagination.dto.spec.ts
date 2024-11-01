import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto'; 

describe('PaginationDto', () => {
    it('should validate correct values', async () => {
        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = 10;
        dto.sortOrder = 'asc';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation for invalid page number', async () => {
        const dto = new PaginationDto();
        dto.page = 0;
        dto.limit = 10;
        dto.sortOrder = 'asc';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('page');
    });

    it('should fail validation for invalid limit number', async () => {
        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = 101;
        dto.sortOrder = 'asc';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('limit');
    });

    it('should accept optional sortOrder', async () => {
        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = 10;
        dto.sortOrder = 'desc';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation for invalid sortOrder', async () => {
        const dto = new PaginationDto();
        dto.page = 1;
        dto.limit = 10;
        // @ts-ignore
        dto.sortOrder = 'invalid';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('sortOrder');
    });
});
