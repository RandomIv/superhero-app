import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroService } from './superhero.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  superhero: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('SuperheroService', () => {
  let service: SuperheroService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get(SuperheroService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates superhero with images', async () => {
      const dto = {
        nickname: 'Batman',
        realName: 'Bruce Wayne',
        originDescription: 'Gotham',
        catchPhrase: 'I am Batman',
        superpowers: ['Rich'],
        images: ['img1', 'img2'],
      };

      const expected = { id: '1', ...dto, images: [] };
      prisma.superhero.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(result).toEqual(expected);
      expect(prisma.superhero.create).toHaveBeenCalledWith({
        data: {
          nickname: dto.nickname,
          realName: dto.realName,
          originDescription: dto.originDescription,
          catchPhrase: dto.catchPhrase,
          superpowers: dto.superpowers,
          images: {
            connect: [{ id: 'img1' }, { id: 'img2' }],
          },
        },
        include: { images: true },
      });
    });
  });

  describe('findAll', () => {
    it('returns paginated data', async () => {
      const heroes = [{ id: '1', nickname: 'Hero' }];
      prisma.superhero.findMany.mockResolvedValue(heroes);
      prisma.superhero.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 5 });

      expect(result).toEqual({
        data: heroes,
        total: 1,
        page: 1,
        lastPage: 1,
      });

      expect(prisma.superhero.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        select: expect.any(Object),
        orderBy: { createdAt: 'asc' },
      });

      expect(prisma.superhero.count).toHaveBeenCalled();
    });

    it('calculates lastPage correctly', async () => {
      prisma.superhero.findMany.mockResolvedValue([]);
      prisma.superhero.count.mockResolvedValue(12);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.lastPage).toBe(3);
    });
  });

  describe('findOne', () => {
    it('returns superhero', async () => {
      const hero = { id: '1', nickname: 'Hero' };
      prisma.superhero.findUniqueOrThrow.mockResolvedValue(hero);

      const result = await service.findOne('1');

      expect(result).toEqual(hero);
      expect(prisma.superhero.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { images: true },
      });
    });

    it('throws if superhero not found', async () => {
      prisma.superhero.findUniqueOrThrow.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.findOne('404')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('updates superhero and replaces images', async () => {
      const dto = {
        nickname: 'NewName',
        images: ['img2'],
      };

      const updated = { id: '1', nickname: 'NewName' };
      prisma.superhero.update.mockResolvedValue(updated);

      const result = await service.update('1', dto);

      expect(result).toEqual(updated);
      expect(prisma.superhero.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          nickname: 'NewName',
          images: {
            set: [{ id: 'img2' }],
          },
        },
        include: { images: true },
      });
    });
  });

  describe('remove', () => {
    it('deletes superhero', async () => {
      const hero = { id: '1', nickname: 'Deleted' };
      prisma.superhero.delete.mockResolvedValue(hero);

      const result = await service.remove('1');

      expect(result).toEqual(hero);
      expect(prisma.superhero.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { images: true },
      });
    });

    it('throws if delete fails', async () => {
      prisma.superhero.delete.mockRejectedValue(new Error('Not found'));

      await expect(service.remove('404')).rejects.toThrow('Not found');
    });
  });
});
