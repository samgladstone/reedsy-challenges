import JobService from './JobsService';
import JobExport, { ExportTypes, JobState } from './JobExport';

export { ExportTypes };

export default class JobsServiceExport extends JobService {
    add(bookId: string, type: ExportTypes, createdAt?: Date, updated_at?: Date, state?: JobState) {
        const job = new JobExport(bookId, type, createdAt, updated_at, state);
        this.addJob(job);
        return job;
    }

    addJob(job: JobExport) {
        this._addJob(job, job.type === 'epub' ? 10 : 25);
    }
};