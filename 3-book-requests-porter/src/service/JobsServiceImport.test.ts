import JobImport, { ImportTypes } from './JobImport';
import JobsServiceImport from './JobsServiceImport';

jest.useFakeTimers();

describe('.addJob()', () => {
    test('The passed in job is added to stored jobs', () => {
        const service = new JobsServiceImport();
        const job = new JobImport('abc', 'word', 'https://reedsy.com/abc');
        service.addJob(job);
        expect(service.jobs).toContain(job);
    });

    test('Imports are processed after 60 seconds ', () => {
        const service = new JobsServiceImport();

        ['word', 'pdf', 'wattpad', 'evernote'].forEach((type: ImportTypes, index) => {
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