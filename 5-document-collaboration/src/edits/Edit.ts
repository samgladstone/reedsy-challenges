import OperationTracker from '../OperationTracker';

export default interface Edit {
    applyTo(activeOperation: OperationTracker): OperationTracker;
}