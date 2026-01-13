import { formSchema } from './hero-form-schema';

describe('Hero Form Schema Validation', () => {
  it('should validate correct data', () => {
    const validData = {
      nickname: 'Iron Man',
      realName: 'Tony Stark',
      originDescription: 'Billionaire genius',
      catchPhrase: 'I am Iron Man',
      superpowers: ['Money', 'Tech'],
      images: [],
      superpowerInput: '',
    };

    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when required fields are missing', () => {
    const invalidData = {
      nickname: '',
      realName: '',
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.nickname).toBeDefined();
    }
  });

  it('should fail with invalid image structure', () => {
    const badData = {
      nickname: 'Test',
      realName: 'Test',
      originDescription: 'Test',
      catchPhrase: 'Test',
      superpowers: [],
      superpowerInput: '',
      images: [{ id: '123' }],
    };

    const result = formSchema.safeParse(badData);
    expect(result.success).toBe(false);
  });
});
