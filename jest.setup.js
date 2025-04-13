// Mock crypto.randomUUID
global.crypto = {
  randomUUID: () => 'mock-uuid'
};

// Mock console methods to avoid cluttering test output
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Only show console output when in debug mode
if (process.env.DEBUG !== 'true') {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}

// Restore console methods after tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
}); 