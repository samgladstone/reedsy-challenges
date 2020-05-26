import OperationTracker from '../src/OperationTracker';

export default function mockTracker(startingText: string, posStarting?: number, posWorking?: number, workingText?: string[]): OperationTracker {
    const applier = new OperationTracker(startingText);
    applier.positionStartingText = posStarting || applier.positionStartingText;
    applier.positionWorkingText = posWorking || applier.positionWorkingText;
    applier.workingText = workingText ? [...workingText] : applier.workingText;

    return applier;
};