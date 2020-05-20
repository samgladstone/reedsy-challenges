import JobExport from './JobExport';

let dateMock, defaultDate, createdDate, updatedDate;

beforeAll(() => {
    defaultDate = new Date(2015, 2, 13, 9, 15, 40, 123);
    createdDate = new Date(2016, 2, 13, 9, 15, 40, 123);
    updatedDate = new Date(2017, 2, 13, 9, 15, 40, 123);
    dateMock = jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);
});

test('Created with the correct field defaults', () => {
    const job = new JobExport('abcd', 'epub');
    expect(job.bookId).toBe('abcd');
    expect(job.type).toBe('epub');

    // Job fields
    expect(job.id).toBeGreaterThan(0);
    expect(job.created_at).toBe(defaultDate);
    expect(job.updated_at).toBe(defaultDate);
    expect(job.state).toBe('pending');
});

test('Created with the correct passed in fields', () => {
    const job = new JobExport('def', 'pdf', createdDate, updatedDate, 'finished');
    expect(job.bookId).toBe('def');
    expect(job.type).toBe('pdf');

    // Job fields
    expect(job.id).toBeGreaterThan(0);
    expect(job.created_at).toBe(createdDate);
    expect(job.updated_at).toBe(updatedDate);
    expect(job.state).toBe('finished');
});