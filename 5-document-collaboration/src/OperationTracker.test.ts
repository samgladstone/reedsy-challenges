import OperationTracker from './OperationTracker';

test('constructor', () => {
    const text = 'Well hey there';
    const tracker = new OperationTracker(text);
    expect(tracker.startingText).toBe(text);
    expect(tracker.positionStartingText).toBe(0);
    expect(tracker.workingText).toEqual([]);
    expect(tracker.positionWorkingText).toBe(0);
});

describe('.isBehindWorkingText', () => {
    test('Returns false if positionWorkingText === workingText.length', () => {
        expect(new OperationTracker('').isBehindWorkingText).toBe(false);

        const tracker = new OperationTracker('Here is some text');
        tracker.positionWorkingText = 4;
        tracker.workingText.push('W', 'h', 'y', ' ');
        expect(tracker.isBehindWorkingText).toBe(false);
    });

    test('Returns true if positionWorkingText < workingText.length', () => {
        const tracker = new OperationTracker('Here is some text');
        tracker.positionWorkingText = 0;
        tracker.workingText.push('W', 'h', 'y', ' ');
        expect(tracker.isBehindWorkingText).toBe(true);

        tracker.positionWorkingText = 3;
        expect(tracker.isBehindWorkingText).toBe(true);
    });
});

describe('.lengthToEndOfWorkingText', () => {
    test('Throws an error if positionWorkingText is beyond the workingText length', () => {
        const err = 'Internal State Error: The position in the working text cannot be beyond the end of the working text';
        const tracker = new OperationTracker('');

        expect(() => tracker.lengthToEndOfWorkingText).not.toThrow(err);

        tracker.positionWorkingText = 1;
        expect(() => tracker.lengthToEndOfWorkingText).toThrow(err);

        tracker.workingText.push('W', 'h', 'y', ' ');
        tracker.positionWorkingText = 5;
        expect(() => tracker.lengthToEndOfWorkingText).toThrow(err);
    });

    test('Returns the length to the end of the working text', () => {
        const tracker = new OperationTracker('');
        expect(tracker.lengthToEndOfWorkingText).toBe(0);

        tracker.workingText.push('W', 'h', 'y', ' ');
        expect(tracker.lengthToEndOfWorkingText).toBe(4);

        tracker.positionWorkingText = 3;
        expect(tracker.lengthToEndOfWorkingText).toBe(1);

        tracker.positionWorkingText = 4;
        expect(tracker.lengthToEndOfWorkingText).toBe(0);
    });
});

test('.text', () => {
    const tracker = new OperationTracker('By Jove, hello there');
    tracker.positionStartingText = 3;
    tracker.workingText.push('W', 'h', 'y', ' ');

    expect(tracker.text).toBe('Why Jove, hello there');
})