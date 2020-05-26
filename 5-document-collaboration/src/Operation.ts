import { Edit, editFactory } from './edits';
import OperationTracker from './OperationTracker';

export default class Operation {
    edits: Edit[];

    constructor(edits: object[] = []) {
        this.edits = edits.reduce<Edit[]>((is: Edit[], e: object): Edit[] => {
            const edit = editFactory(e);
            if (edit) is.push(edit);
            return is;
        }, []);
    }

    apply(string) {
        // TODO: Have something that calculates the needed length of the passed in string and errors if its the wrong length
        // It could be done during creation
        const tracker = this.edits.reduce((tracker, edit) => edit.applyTo(tracker), new OperationTracker(string))
        return tracker.text;
    }

    combine(op: Operation) {
        this.edits = Operation._combineEdits(this, op);
    }

    static combine(op1: Operation, op2: Operation): Operation {
        const combinedEdits = Operation._combineEdits(op1, op2);
        return new Operation(combinedEdits);
    }

    private static _combineEdits(op1: Operation, op2: Operation): Edit[] {
        // TODO
        return [];
    }
}