import { baseArticleQuery } from '../article.schema';

describe('Test base article query', () => {
  // Verify that the baseArticleQuery object is created successfully.
  it('should create baseArticleQuery object successfully', () => {
    const result = baseArticleQuery.safeParse({ limit: '20', offset: '0' });
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ limit: 20, offset: 0 });
    }
  });

  // Verify that limit property is not a non-negative integer as a string.
  it('should not validate limit property as a non-negative integer string', () => {
    const result = baseArticleQuery.safeParse({ limit: 'abc', offset: '0' });
    expect(result.success).toBe(false)
  });

  it('should not validate property as a non-negative integer string', () => {
    const result = baseArticleQuery.safeParse({ limit: '20', offset: '-2' });
    expect(result.success).toBe(false)
  });
});
