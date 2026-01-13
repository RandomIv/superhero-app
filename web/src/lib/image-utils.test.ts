import { getImageUrl } from './image-utils';

describe('getImageUrl Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return placeholder for empty inputs', () => {
    expect(getImageUrl(null)).toBe('/superhero.jpg');
    expect(getImageUrl(undefined)).toBe('/superhero.jpg');
    expect(getImageUrl('')).toBe('/superhero.jpg');
  });

  it('should return absolute URLs as is', () => {
    const url = 'https://google.com/img.png';
    expect(getImageUrl(url)).toBe(url);
  });

  it('should append API base URL to relative paths', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';

    const result = getImageUrl('uploads/test.jpg');

    expect(result).toContain('http://localhost:5000');
    expect(result).toContain('/uploads/test.jpg');
  });

  it('should handle missing leading slash correctly', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';
    const result = getImageUrl('images/pic.png');

    expect(result).toContain('/images/pic.png');
  });
});
