import JobService from './JobsService';
import JobExport from './JobExport';

export default class JobsServiceExport extends JobService {
    addJob(job: JobExport) { this._addJob(job, job.type === 'epub' ? 10 : 25); }
};