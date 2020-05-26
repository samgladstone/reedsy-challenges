import Job from './Job';

export default interface JobsByState {
    pending: Job[],
    finished: Job[],
};