// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db'

// Mock TextEncoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch
global.fetch = jest.fn();

// Mock mongoose
const mongoose = require('mongoose');
mongoose.connect = jest.fn();
mongoose.connection = {
  on: jest.fn(),
  once: jest.fn(),
  close: jest.fn()
}; 