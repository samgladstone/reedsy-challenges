import OperationTracker from '../src/OperationTracker';

export default function mockTracker(startingText: string, posStarting?: number, posWorking?: number, workingText?: string[]): OperationTracker {
    const applier = new OperationTracker(startingText);
    applier.positionStartingText = posStarting || applier.positionStartingText;
    applier.positionWorkingText = posWorking || applier.positionWorkingText;

    if (workingText)
        Array.prototype.splice.apply(applier.workingText, [0, 0, ...workingText]);

    return applier;
};