import Job from './Job';

export default interface JobsByState {
    pending: Array<Job>,
    finished: Array<Job>,
};