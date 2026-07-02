import {apiClient} from '../../../source/api/client.js';
import {searchAuthors, getAuthorProfile} from '../../../source/api/authors.js';
import {mockAuthorProfile} from '../../fixtures/data.js';

jest.mock('../../../source/api/client.js', () => ({
	apiClient: {get: jest.fn()},
}));

const get = apiClient.get as unknown as jest.Mock;

const searchResponse = {
	authors: [mockAuthorProfile],
	totalCount: 1,
	page: 1,
	pageSize: 10,
	totalPages: 1,
	hasNextPage: false,
	hasPreviousPage: false,
};

describe('api/authors - searchAuthors', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		get.mockResolvedValue({data: searchResponse});
	});

	it('sends the author name with default pagination', async () => {
		await searchAuthors('John Smith');

		expect(get).toHaveBeenCalledWith('/authors', {
			params: {authorName: 'John Smith', page: 1, pageSize: 10},
		});
	});

	it('sends explicit pagination parameters', async () => {
		await searchAuthors('test', 2, 15);

		expect(get).toHaveBeenCalledWith('/authors', {
			params: {authorName: 'test', page: 2, pageSize: 15},
		});
	});

	it('returns the response payload', async () => {
		const result = await searchAuthors('test');

		expect(result).toEqual(searchResponse);
	});
});

describe('api/authors - getAuthorProfile', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		get.mockResolvedValue({data: mockAuthorProfile});
	});

	it('requests the correct endpoint', async () => {
		await getAuthorProfile('alice-smith');

		expect(get).toHaveBeenCalledWith('/authors/alice-smith');
	});

	it('returns the author profile', async () => {
		const result = await getAuthorProfile('alice-smith');

		expect(result).toEqual(mockAuthorProfile);
	});

	it('propagates rejections from the client', async () => {
		get.mockRejectedValue(new Error('Not found'));

		await expect(getAuthorProfile('invalid')).rejects.toThrow('Not found');
	});
});
