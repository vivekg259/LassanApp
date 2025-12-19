/**
 * Minimal sanity test to verify Jest test runner is working.
 * This test does not import any app code.
 */
describe('Test Harness Bootstrap', () => {
  it('should run Jest successfully', () => {
    expect(true).toBe(true);
  });

  it('should have basic Jest matchers available', () => {
    expect(1 + 1).toBe(2);
    expect('test').toBeDefined();
    expect(null).toBeNull();
  });
});
