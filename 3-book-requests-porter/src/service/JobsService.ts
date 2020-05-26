import Job from './Job';
import JobsByState from './JobsByState';

export default class JobsService {
    readonly jobs: Job[] = [];

    listJobsByState(): JobsByState {
        return this.jobs.reduce((jobsByState: JobsByState, job: Job): JobsByState => {
            if (job.state === 'pending')
                jobsByState.pending.push(job);
            else
                jobsByState.finished.push(job);

            return jobsByState;
        }, {
            pending: [],
            finished: [],
        });
    }

    protected _addJob(job: Job, processingTimeSecs: number) {
        this.jobs.push(job);
        setTimeout((): void => { job.finalise(); }, processingTimeSecs * 1000);
    }
}