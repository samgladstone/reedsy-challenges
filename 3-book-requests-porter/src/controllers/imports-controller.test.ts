import { getImportList, postImport } from './imports-controller';
import { Request } from 'express';
import { importJobService, importTypes } from '../service';
import JobImport from '../service/JobImport';

const mockResponse = () => {
    const res: any = {};

    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
};

test('getImportList', () => {
    const mockData = { pending: [], finished: [] };
    const listJobsByStateSpy = jest.spyOn(importJobService, 'listJobsByState').mockReturnValue(mockData);

    const response = mockResponse();
    getImportList({} as Request, response);

    expect(listJobsByStateSpy).toBeCalledTimes(1);

    expect(response.json).toBeCalledTimes(1);
    expect(response.json).lastCalledWith(mockData);

    listJobsByStateSpy.mockRestore();
});

describe('postImport', () => {
    const mockRequest = (bookId?: any, type?: string, url?: any): Request => ({ body: { bookId, type, url } }) as Request;

    test('Returns a 400 if there is not a valid book id', () => {
        [undefined, 1, true].forEach(id => {
            const res = mockResponse();
            postImport(mockRequest(id, 'pdf', 'https://reedsy.com/'), res);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).lastCalledWith(400);

            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).lastCalledWith('A book ID is required');

            expect(res.json).not.toHaveBeenCalled();
        });
    });

    test('Returns a 400 if there is not a valid url', () => {
        [undefined, 1, true].forEach(url => {
            const res = mockResponse();
            postImport(mockRequest('abc', 'pdf', url), res);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).lastCalledWith(400);

            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).lastCalledWith('A url is required');

            expect(res.json).not.toHaveBeenCalled();
        });
    });

    test('Returns a 400 if there is no type sent', () => {
        const res = mockResponse();
        postImport(mockRequest('abc', undefined, 'https://reedsy.com/'), res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).lastCalledWith(400);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).lastCalledWith('An import type is required');

        expect(res.json).not.toHaveBeenCalled();
    });

    test('Returns a 400 if the import type is invalid', () => {
        const res = mockResponse();
        postImport(mockRequest('abc', 'json', 'https://reedsy.com/'), res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).lastCalledWith(400);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).lastCalledWith('This import type is not supported');

        expect(res.json).not.toHaveBeenCalled();
    });

    test('All valid import types can be sent', () => {
        jest.useFakeTimers(); // Otherwise we get "A worker process has failed to exit gracefully and has been force exited."
        importTypes.forEach(it => {
            const res = mockResponse();
            postImport(mockRequest('abc', it, 'https://reedsy.com/'), res);
            expect(res.json).toHaveBeenCalledTimes(1);
        });
    });

    test('Queues a job and returns the jobs details', () => {
        const mockJob = new JobImport('abc', 'evernote', 'https://reedsy.com/');
        const addSpy = jest.spyOn(importJobService, 'add').mockReturnValue(mockJob);

        const res = mockResponse();
        postImport(mockRequest('abc', importTypes[0], 'https://reedsy.com/'), res);

        expect(addSpy).toBeCalledTimes(1);
        expect(addSpy).lastCalledWith('abc', importTypes[0], 'https://reedsy.com/');

        expect(res.json).toBeCalledTimes(1);
        expect(res.json).lastCalledWith(mockJob);

        addSpy.mockRestore();
    });
});