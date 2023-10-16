import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // getAll() test
  describe('getAll', () => {
    // getAll()를 실행할 때마다 Movie 배열을 리턴하는데
    // 어쩔 때는 빈 배열일 수도 있지만 어쨌든 배열이야 그래서 그걸 테스트 할 것이다.

    it('should return an array', () => {
      const result = service.getAll();

      // result가 배열을 리턴하는지 안하는지 테스트
      expect(result).toBeInstanceOf(Array);
    });
  });

  // getOne() test
  describe('getOne', () => {
    it('should return a movie', () => {
      // 테스트를 위한 movie 생성
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      const movie = service.getOne(1);

      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID 999 not found');
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      // 테스트를 위한 movie 생성
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toEqual(beforeDelete - 1);
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should return a 404', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe("upadte", () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });

      service.update(1, {
        title: 'Updated Test',
      });

      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Test');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });


});
