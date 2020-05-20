import Job, { JobState } from './Job';

export { JobState };
export type ExportTypes = 'epub' | 'pdf';

export default class JobExport extends Job {
    bookId: string;
    type: ExportTypes;

    constructor(bookId: string, type: ExportTypes, createdAt?: Date, updated_at?: Date, state?: JobState) {
        super(createdAt, updated_at, state);
        this.bookId = bookId;
        this.type = type;
    }
};