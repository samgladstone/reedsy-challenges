import Edit from './Edit';
import OperationTracker from '../OperationTracker';

export default class Insert implements Edit {
    insert: string;

    constructor(insert: string) {
        this.insert = insert;
    }

    applyTo(activeOperation: OperationTracker): OperationTracker {
        Array.prototype.splice.apply(
            activeOperation.workingText,
            [
                activeOperation.positionWorkingText,
                0,
                ...this.insert.split('')
            ]
        );

        activeOperation.positionWorkingText += this.insert.length;

        return activeOperation;
    };

    static canBeCreatedFrom(edit: object): boolean {
        // Extra safetey in case of being passed in through API
        if (!edit) return false;

        const insert = (<any>edit).insert;
        return !!(
            insert === '' ||
            insert &&
            typeof insert === 'string'
        );
    }

    static createFrom(edit: object): Insert | undefined {
        if (Insert.canBeCreatedFrom(edit))
            return new Insert((<any>edit).insert);
    }
};