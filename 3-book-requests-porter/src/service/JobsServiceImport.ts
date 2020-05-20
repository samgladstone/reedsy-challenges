import JobService from './JobsService';
import JobImport from './JobImport';

export default class JobsServiceImport extends JobService {
    addJob(job: JobImport) { this._addJob(job, 60); }
};