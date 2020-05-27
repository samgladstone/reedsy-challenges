import { Delete, Edit, editFactory, Insert, Move } from './edits';
import OperationTracker from './OperationTracker';

export default class Operation {
    edits: Edit[];

    constructor(edits: object[] = []) {
        this.edits = ensureAllAreEdits(edits);
    }

    apply(string) {
        // TODO: Have something that calculates the needed length of the passed in string and errors if its the wrong length
        // It could be done during creation
        const tracker = this.edits.reduce((tracker, edit) => edit.applyTo(tracker), new OperationTracker(string))
        return tracker.text;
    }

    combine(op: Operation) {
        this.edits = Operation._combineEdits(this, op)
            .reduce<Edit[]>((is: Edit[], e: object): Edit[] => {
                const edit = editFactory(e);
                if (edit) is.push(edit);
                return is;
            }, []);
        return this;
    }

    static combine(op1: Operation, op2: Operation): Operation {
        const combinedEdits = Operation._combineEdits(op1, op2);
        return new Operation(combinedEdits);
    }

    private static _combineEdits(op1: Operation, op2: Operation): Edit[] {
        let indexInOp1 = 0;
        let op1Length = op1.edits.length;
        let indexInOp2 = 0;
        let op2Length = op2.edits.length;
        let op1PositionInStr = 0;
        let op2PositionInStr = 0;
        let combinedPositionInStr = 0;
        const combinedEdits = [];


        while (indexInOp1 < op1Length || indexInOp2 < op2Length) {
            // Update if one of the operations is complete
            const op1Complete = indexInOp1 === op1Length;
            const op2Complete = indexInOp2 === op2Length;

            let op1Changes: CalculatedOpChanges;
            let op2Changes: CalculatedOpChanges;

            // We skip working on an operation if the other operation is not as far along in the string 
            const skipOp1 = indexInOp1 === op1Length || op1PositionInStr > op2PositionInStr && !op2Complete;
            const skipOp2 = indexInOp2 === op2Length || op2PositionInStr > op1PositionInStr && !op1Complete;

            if (!skipOp1) {
                op1Changes = calculateNextOperations(indexInOp1, op1.edits);
                indexInOp1 = op1Changes.newIndex;
                op1PositionInStr += op1Changes.delete;
            }
            if (!skipOp2) {
                op2Changes = calculateNextOperations(indexInOp2, op2.edits);
                indexInOp2 = op2Changes.newIndex;
                op2PositionInStr += op2Changes.delete;
            }

            let changes: { delete: number, insert?: string, move?: number };

            if (op1Changes && op2Changes) {
                changes = {
                    delete: Math.max(op1Changes.delete, op2Changes.delete)
                };

                // Lets start by getting the move data for each operation
                const op1Move = calculateMoveForOneOpearation(indexInOp1, op1Changes.delete, op1.edits, combinedPositionInStr, op2PositionInStr, op2Complete);
                const op2Move = calculateMoveForOneOpearation(indexInOp2, op2Changes.delete, op2.edits, combinedPositionInStr, op1PositionInStr, op1Complete);

                // We could end up in a situation where one of the operations next edits falls inside the delete of the other operation
                // Currently the position in the string includes up to where the operation has deleted, so we can check if it moves out of
                // the delete range of the other string
                const op1HasDeleteOverlap = op1Changes.delete < op2Changes.delete && op1PositionInStr + op1Move.move < op2PositionInStr;
                const op2HasDeleteOverlap = op2Changes.delete < op1Changes.delete && op2PositionInStr + op2Move.move < op1PositionInStr;

                // Ok, now lets move the operations along
                indexInOp1 = op1Move.newIndexInOp;
                op1PositionInStr += op1Move.addToOpPositionInString;
                indexInOp2 = op2Move.newIndexInOp;
                op2PositionInStr += op2Move.addToOpPositionInString;

                // Move the smaller amount of two, the other one will catch up later
                changes.move = Math.min(op1Move.move || 0, op2Move.move || 0);

                // We could have a problem if one delete is longer than the other 
                if (op1HasDeleteOverlap) {
                    const result = calculateDeleteForOtherOperation(indexInOp1, op1PositionInStr, combinedPositionInStr, changes.delete, op1.edits);
                    indexInOp1 = result.newOpIndex;
                    op1PositionInStr = result.newOpPositionInString;
                    changes.delete = result.newDeleteCount;
                }
                // they cant both have delete overlap
                else if (op2HasDeleteOverlap) {
                    const result = calculateDeleteForOtherOperation(indexInOp2, op2PositionInStr, combinedPositionInStr, changes.delete, op2.edits);
                    indexInOp2 = result.newOpIndex;
                    op2PositionInStr = result.newOpPositionInString;
                    changes.delete = result.newDeleteCount;
                }

                // Ok lets do the insert
                const op1Insert = op1Changes.insert;
                const op2Insert = op2Changes.insert;

                // If both have inserts...
                // This could be adjusted, like perhaps we want to keep the longest insert?
                changes.insert = op1Insert && op2Insert
                    // If the second operations insert contains the first, then use that
                    ? op2Insert.indexOf(op1Insert) >= 0
                        ? op2Insert
                        // Otherwise we choose to prioritise the firsts insert
                        : op1Insert
                    // Otherwise, if only one contains inserts, then we can use that
                    : op2Insert || op1Insert;
            }
            else if (op1Changes) {
                changes = {
                    delete: op1Changes.delete,
                    insert: op1Changes.insert
                };

                // lets calculate the move amount
                const move = calculateMoveForOneOpearation(indexInOp1, op1Changes.delete, op1.edits, combinedPositionInStr, op2PositionInStr, op2Complete);
                indexInOp1 = move.newIndexInOp;
                op1PositionInStr += move.addToOpPositionInString;
                if (move.move) changes.move = move.move;

                // we may need to delete in op 2 if we have deleted past it's insert
                if (changes.delete) {
                    const result = calculateDeleteForOtherOperation(indexInOp2, op2PositionInStr, combinedPositionInStr, changes.delete, op2.edits);
                    indexInOp2 = result.newOpIndex;
                    op2PositionInStr = result.newOpPositionInString;
                    changes.delete = result.newDeleteCount;
                }
            }
            else if (op2Changes) {
                changes = {
                    delete: op2Changes.delete,
                    insert: op2Changes.insert
                };

                // Work out how far to move
                const move = calculateMoveForOneOpearation(indexInOp2, op2Changes.delete, op2.edits, combinedPositionInStr, op1PositionInStr, op1Complete);
                indexInOp2 = move.newIndexInOp;
                op2PositionInStr += move.addToOpPositionInString;
                if (move.move) changes.move = move.move;

                // we may need to delete in op 1 if we have deleted past it's insert
                if (changes.delete) {
                    const result = calculateDeleteForOtherOperation(indexInOp1, op1PositionInStr, combinedPositionInStr, changes.delete, op1.edits);
                    indexInOp1 = result.newOpIndex;
                    op1PositionInStr = result.newOpPositionInString;
                    changes.delete = result.newDeleteCount;
                }
            }

            // Ok we have calculated all the changes, now lets add them to the result
            if (changes.delete > 0) {
                combinedPositionInStr += changes.delete;
                combinedEdits.push({ delete: changes.delete });
            }

            if (changes.insert && changes.insert.length > 0)
                combinedEdits.push({ insert: changes.insert });

            // Before we move, we could end up behind both strings, then move up to the nearest
            changes.move = changes.move || 0;

            if (combinedPositionInStr + changes.move < op1PositionInStr && combinedPositionInStr + changes.move < op2PositionInStr
                && indexInOp1 < op1Length
                && indexInOp2 < op2Length)
                changes.move += Math.min(op1PositionInStr, op2PositionInStr) - combinedPositionInStr;
            // Or we could be behind op1 and op2 has finished its business
            else if (combinedPositionInStr + changes.move < op1PositionInStr && indexInOp1 < op1Length && indexInOp2 === op2Length)
                changes.move += op1PositionInStr - combinedPositionInStr;
            // // Or we could be behind op2 and op1 has finished its business
            else if (combinedPositionInStr + changes.move < op2PositionInStr && indexInOp2 < op2Length && indexInOp1 === op1Length)
                changes.move += op2PositionInStr - combinedPositionInStr;

            if (changes.move < 0 || changes.move > 0) {
                combinedPositionInStr += changes.move;
                combinedEdits.push({ move: changes.move });
            }
        }

        return ensureAllAreEdits(combinedEdits);
    }
}

export const ensureAllAreEdits = (edits: object[]): Edit[] =>
    edits.reduce<Edit[]>((is: Edit[], e: object): Edit[] => {
        const edit = editFactory(e);
        if (edit) is.push(edit);
        return is;
    }, []);

interface CalculatedOpChanges {
    newIndex: number,
    delete: number,
    insert: string,
}

const calculateNextOperations = (
    startIndex: number,
    edits: Edit[]
): CalculatedOpChanges => {
    const maximumLength = edits.length;

    let newIndex: number = startIndex;
    let deleteCount: number = 0;
    let inserts: string[] = [];

    while (newIndex < maximumLength) {
        const nextOp = edits[newIndex];
        // If we get to a move, skip that and resolve at the end
        if (nextOp instanceof Move) break;
        newIndex++;
        if (nextOp instanceof Delete)
            deleteCount += nextOp.delete;
        else if (nextOp instanceof Insert)
            inserts.push(nextOp.insert);
        else
            throw new Error('Unrecognised operation type');
    }

    return { newIndex, delete: deleteCount, insert: inserts.join('') };
}

const calculateDeleteForOtherOperation = (
    indexInOp: number,
    opPositionInString: number,
    combinedPositionInStr: number,
    deleteCount: number,
    edits: Edit[]
): {
    newOpIndex: number;
    newOpPositionInString: number
    newDeleteCount: number;
} => {
    let newOpIndex = indexInOp; 1
    let newOpPositionInString = opPositionInString; 4
    let newDeleteCount = deleteCount; 4

    const deleteToPosition = combinedPositionInStr + newDeleteCount;
    while (deleteToPosition > newOpPositionInString) {
        const nextOp = edits[newOpIndex];

        if (!nextOp) break;
        // we can skip anything that was inserted in deleted text
        if (nextOp instanceof Insert)
            newOpIndex++;
        else if (nextOp instanceof Move) {
            newOpIndex++;
            newOpPositionInString += nextOp.move;
        }
        else if (nextOp instanceof Delete) {
            newOpIndex++;
            newOpPositionInString += nextOp.delete;
        }
        else
            throw new Error('Unrecognised operation type');
    }

    return { newOpIndex, newOpPositionInString, newDeleteCount }
}

const calculateMoveForOneOpearation = (
    indexInOp: number,
    currentDeleteCount: number,
    edits: Edit[],
    combinedPosition: number,
    otherOpPosition: number,
    otherOpComplete: boolean,
): {
    addToOpPositionInString: number,
    newIndexInOp: number,
    move: number,
} => {
    let addToOpPositionInString = 0;
    let newIndexInOp = indexInOp;
    let move = 0;
    const opLength = edits.length;

    while (newIndexInOp < opLength) {
        const nextOp = edits[newIndexInOp];
        if (!(nextOp instanceof Move)) break;

        newIndexInOp++;
        addToOpPositionInString += nextOp.move;
        move += nextOp.move;

        // We cannot move past the location that op2 is at in the string
        // But we should still move op1 past this location, so it comes after the above
        if (!otherOpComplete && combinedPosition + currentDeleteCount + move > otherOpPosition) {
            move = otherOpPosition - combinedPosition;
            break;
        }
    }

    return {
        addToOpPositionInString,
        newIndexInOp,
        move
    };
}
