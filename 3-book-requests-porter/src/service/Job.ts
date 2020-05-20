let idGenerator: number = 1;

export type JobState = 'pending' | 'finished';

export default class Job {
    id: number;
    created_at: Date;
    updated_at: Date;
    state: JobState;

    constructor(createdAt?: Date, updated_at?: Date, state: JobState = 'pending') {
        this.id = idGenerator++;
        this.created_at = createdAt || new Date();
        this.updated_at = updated_at || new Date();
        this.state = state;
    }

    finalise(): Job {
        this.updated_at = new Date();
        this.state = 'finished';
        return this;
    }
};