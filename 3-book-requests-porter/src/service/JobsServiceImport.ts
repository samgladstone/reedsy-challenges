import JobService from './JobsService';
import JobImport, { ImportTypes, JobState } from './JobImport';

export { ImportTypes };

export default class JobsServiceImport extends JobService {
    add(bookId: string, type: ImportTypes, url: string, createdAt?: Date, updated_at?: Date, state?: JobState) {
        const job = new JobImport(bookId, type, url, createdAt, updated_at, state);
        this.addJob(job);
        return job;
    }

    addJob(job: JobImport) {
        this._addJob(job, 60);
    }
};