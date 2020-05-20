import Job, { JobState } from './Job';

export type ImportTypes = 'word' | 'pdf' | 'wattpad' | 'evernote';

export default class JobImport extends Job {
    bookId: string;
    type: ImportTypes;
    url: string;

    constructor(bookId: string, type: ImportTypes, url: string, createdAt?: Date, updated_at?: Date, state?: JobState) {
        super(createdAt, updated_at, state);
        this.bookId = bookId;
        this.type = type;
        this.url = url;
    }
};