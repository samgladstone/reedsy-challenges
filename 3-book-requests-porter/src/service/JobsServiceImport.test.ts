import importTypes from './importTypes';
import JobImport, { ImportTypes } from './JobImport';
import JobsServiceImport from './JobsServiceImport';

jest.useFakeTimers();

let dateMock, defaultDate, createdDate, updatedDate;

beforeAll(() => {
    defaultDate = new Date(2015, 2, 13, 9, 15, 40, 123);
    createdDate = new Date(2016, 2, 13, 9, 15, 40, 123);
    updatedDate = new Date(2017, 2, 13, 9, 15, 40, 123);
    dateMock = jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);
})

test('.add()', () => {
    const service = new JobsServiceImport();
    const addJob = jest.spyOn(service, 'addJob');
    const job = service.add('def', 'pdf', 'https://reedsy.com/abc', createdDate, updatedDate, 'finished');

    expect(addJob).toBeCalledTimes(1);
    expect(addJob).lastCalledWith(job);

    expect(job.bookId).toBe('def');
    expect(job.type).toBe('pdf');
    expect(job.url).toBe('https://reedsy.com/abc');

    // Job fields
    expect(job.id).toBeGreaterThan(0);
    expect(job.created_at).toBe(createdDate);
    expect(job.updated_at).toBe(updatedDate);
    expect(job.state).toBe('finished');
});

describe('.addJob()', () => {
    test('The passed in job is added to stored jobs', () => {
        const service = new JobsServiceImport();
        const job = new JobImport('abc', 'word', 'https://reedsy.com/abc');
        service.addJob(job);
        expect(service.jobs).toContain(job);
    });

    test('Imports are processed after 60 seconds ', () => {
        const service = new JobsServiceImport();

        importTypes.forEach((type: ImportTypes, index) => {
            const job = new JobImport('abc', type, 'https://reedsy.com/abc');
            service.addJob(job);
            expect(setTimeout).toHaveBeenCalledTimes(index + 1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 60000);

        });
    });

    test('The job is finalised after the processing time', () => {
        const service = new JobsServiceImport();
        const job = new JobImport('abc', 'wattpad', 'https://reedsy.com/abc');
        jest.spyOn(job, 'finalise');

        expect(job.finalise).not.toHaveBeenCalled();
        service.addJob(job);
        expect(job.finalise).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(job.finalise).toHaveBeenCalled();
    });
});