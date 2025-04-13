// jest-dom adds custom jest matchers for asserting on DOM nodes
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

// Set up any global variables or configuration needed for tests
global.crypto = {
  randomUUID: () => 'mock-uuid'
} as Crypto; 