import Job from './Job';

let dateMock;
let defaultDate;
let createdDate;
let updatedDate;

beforeAll(() => {
    defaultDate = new Date(2015, 2, 13, 9, 15, 40, 123);
    createdDate = new Date(2016, 2, 13, 9, 15, 40, 123);
    updatedDate = new Date(2017, 2, 13, 9, 15, 40, 123);
    dateMock = jest.spyOn(global, 'Date').mockImplementation(() => defaultDate);
});

test('Created with the correct field defaults', () => {
    const job = new Job();
    expect(job.id).toBeGreaterThan(0);
    expect(job.created_at).toBe(defaultDate);
    expect(job.updated_at).toBe(defaultDate);
    expect(job.state).toBe('pending');
});

test('Created with the correct passed in fields', () => {
    const job = new Job(createdDate, updatedDate, 'finished');
    expect(job.created_at).toBe(createdDate);
    expect(job.updated_at).toBe(updatedDate);
    expect(job.state).toBe('finished');
});

test('Id is being incremeneted', () => {
    const job1 = new Job();
    const job2 = new Job();
    const job3 = new Job();

    expect(job2.id).toBe(job1.id + 1);
    expect(job3.id).toBe(job1.id + 2);
});

test('Job.finalise', () => {
    const job = new Job();
    expect(job.updated_at).toBe(defaultDate);
    expect(job.state).toBe('pending');

    dateMock.mockImplementationOnce(() => updatedDate);

    expect(job.finalise()).toBe(job);

    expect(job.updated_at).toBe(updatedDate);
    expect(job.state).toBe('finished');
});