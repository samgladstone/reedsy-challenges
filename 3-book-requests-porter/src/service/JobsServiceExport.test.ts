import JobExport from './JobExport';
import JobsServiceExport from './JobsServiceExport';

jest.useFakeTimers();

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