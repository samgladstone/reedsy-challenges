import JobExport from './JobExport';
import JobsServiceExport from './JobsServiceExport';

jest.useFakeTimers();
let dateMock, defaultDate, createdDate, updatedDate;

beforeAll(() => {
    defaultDate = new Date(2015, 2, 13, 9, 15, 40, 123);
    createdDate = new Date(2016, 2, 13, 9, 15, 40, 123);
    updatedDate = new Date(2017, 2, 13, 9, 15, 40, 123);
    dateMock = jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);
})

test('.add()', () => {
    const service = new JobsServiceExport();
    const addJob = jest.spyOn(service, 'addJob');
    const job = service.add('def', 'pdf', createdDate, updatedDate, 'finished');

    expect(addJob).toBeCalledTimes(1);
    expect(addJob).lastCalledWith(job);

    expect(job.bookId).toBe('def');
    expect(job.type).toBe('pdf');

    // Job fields
    expect(job.id).toBeGreaterThan(0);
    expect(job.created_at).toBe(createdDate);
    expect(job.updated_at).toBe(updatedDate);
    expect(job.state).toBe('finished');
});

describe('.addJob()', () => {
    test('The passed in job is added to stored jobs', () => {
        const service = new JobsServiceExport();
        const job = new JobExport('abc', 'pdf');
        service.addJob(job);
        expect(service.jobs).toContain(job);
    });

    test('EPUBs are processed after 10 seconds ', () => {
        const service = new JobsServiceExport();
        const job = new JobExport('abc', 'epub');
        service.addJob(job);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
    });

    test('PDFs are processed after 25 seconds ', () => {
        const service = new JobsServiceExport();
        const job = new JobExport('abc', 'pdf');
        service.addJob(job);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 25000);
    });

    test('The job is finalised after the processing time ', () => {
        const service = new JobsServiceExport();
        const job = new JobExport('abc', 'pdf');
        jest.spyOn(job, 'finalise');

        expect(job.finalise).not.toHaveBeenCalled();
        service.addJob(job);
        expect(job.finalise).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(job.finalise).toHaveBeenCalled();
    });
});