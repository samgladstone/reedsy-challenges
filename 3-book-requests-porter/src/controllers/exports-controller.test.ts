import { getExportsList, postExport } from './exports-controller';
import { Request } from 'express';
import { exportJobService, exportTypes } from '../service';
import JobExport from '../service/JobExport';

const mockResponse = () => {
    const res: any = {};

    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
};

test('getExportsList', () => {
    const mockData = { pending: [], finished: [] };
    const listJobsByStateSpy = jest.spyOn(exportJobService, 'listJobsByState').mockReturnValue(mockData);

    const res = mockResponse();
    getExportsList({} as Request, res);

    expect(listJobsByStateSpy).toBeCalledTimes(1);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).lastCalledWith(mockData);

    listJobsByStateSpy.mockRestore();
});

describe('postExport', () => {
    const mockRequest = (bookId?: any, type?: string): Request => ({ body: { bookId, type } }) as Request;

    test('Returns a 400 if there is not a valid book id', () => {
        [undefined, 1, true].forEach(id => {
            const res = mockResponse();
            postExport(mockRequest(id, 'pdf'), res);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).lastCalledWith(400);

            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).lastCalledWith('A valid book ID is required');

            expect(res.json).not.toHaveBeenCalled();
        });
    });

    test('Returns a 400 if there is no type sent', () => {
        const res = mockResponse();
        postExport(mockRequest('abc', undefined), res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).lastCalledWith(400);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).lastCalledWith('An export type is required');

        expect(res.json).not.toHaveBeenCalled();
    });

    test('Returns a 400 if the export type is invalid', () => {
        const res = mockResponse();
        postExport(mockRequest('abc', 'word'), res);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).lastCalledWith(400);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).lastCalledWith('This export type is not supported');

        expect(res.json).not.toHaveBeenCalled();
    });

    test('All valid import types can be sent', () => {
        jest.useFakeTimers();  // Otherwise we get "A worker process has failed to exit gracefully and has been force exited."
        exportTypes.forEach(et => {
            const res = mockResponse();
            postExport(mockRequest('abc', et), res);
            expect(res.json).toHaveBeenCalledTimes(1);
        });
    });

    test('Queues a job and returns the jobs details', () => {
        const mockJob = new JobExport('abc', 'epub');
        const addSpy = jest.spyOn(exportJobService, 'add').mockReturnValue(mockJob);

        const res = mockResponse();
        postExport(mockRequest('def', exportTypes[0]), res);

        expect(addSpy).toBeCalledTimes(1);
        expect(addSpy).lastCalledWith('def', exportTypes[0]);

        expect(res.json).toBeCalledTimes(1);
        expect(res.json).lastCalledWith(mockJob);

        addSpy.mockRestore();
    });
});