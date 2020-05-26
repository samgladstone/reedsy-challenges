import Edit from './Edit';
import OperationTracker from '../OperationTracker';

export default class Delete implements Edit {
    delete: number;

    constructor(deleteX: number) {
        this.delete = deleteX;
    }

    applyTo(activeOperation: OperationTracker): OperationTracker {
        let deleteFromStartingText = this.delete;

        if (activeOperation.isBehindWorkingText) {
            // We only delete characters from the starting text if delete the tail of the working text
            // and still have more characters to delete
            deleteFromStartingText = Math.max(this.delete - activeOperation.lengthToEndOfWorkingText, 0);
            activeOperation.workingText.splice(activeOperation.positionWorkingText, this.delete);
        }

        if (activeOperation.startingText.length - activeOperation.positionStartingText - deleteFromStartingText < 0)
            throw new Error('Cannot delete characters beyond the end of the string');

        activeOperation.positionStartingText += deleteFromStartingText;

        return activeOperation;
    }

    static canBeCreatedFrom(edit: object): boolean {
        // Extra safetey in case of being passed in through API
        if (!edit) return false;

        const deleteVal = (<any>edit).delete;
        return !!(
            deleteVal === 0 || // Technically delete: 0 makes sense, alternatively it could be considered an invalid value so skipped
            deleteVal &&
            Number.isInteger(deleteVal) &&
            deleteVal > 0
        );
    }

    static createFrom(edit: object): Delete | undefined {
        if (Delete.canBeCreatedFrom(edit))
            return new Delete((<any>edit).delete);
    }
};