export default {
  post: jest.fn().mockResolvedValue({
    data: { user: { id: 1, username: 'testuser' } },
  }),
  get: jest.fn().mockResolvedValue({ data: {} }),
};