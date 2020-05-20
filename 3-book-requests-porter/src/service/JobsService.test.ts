import Job from './Job';
import JobsService from './JobsService';

test('.listJobsByState()', () => {
    const service = new JobsService();
    const pending1 = new Job();
    const pending2 = new Job();
    const pending3 = new Job();
    const finished1 = new Job().finalise();
    const finished2 = new Job().finalise();
    service.jobs.push(pending1, finished1, pending2, pending3, finished2);

    expect(service.listJobsByState()).toEqual({
        pending: [pending1, pending2, pending3],
        finished: [finished1, finished2]
    });
});