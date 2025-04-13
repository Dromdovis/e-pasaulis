// Import Jest DOM extensions for testing
import '@testing-library/jest-dom';

// Mock the PocketBase client
jest.mock('./src/lib/db', () => ({
  pb: {
    collection: jest.fn().mockReturnValue({
      create: jest.fn().mockImplementation(data => ({ ...data, id: 'mock-id' })),
      update: jest.fn().mockResolvedValue(true)
    })
  }
}));

// Set up global variables needed for tests
global.crypto = {
  randomUUID: () => 'mock-uuid'
} as Crypto; 