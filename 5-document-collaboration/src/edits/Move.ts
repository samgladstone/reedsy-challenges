import Edit from './Edit';
import OperationTracker from '../OperationTracker';

export default class Move implements Edit {
    move: number;

    constructor(move: number) {
        this.move = move;
    }

    applyTo(activeOperation: OperationTracker): OperationTracker {
        if (this.move < 0) {
            activeOperation.positionWorkingText += this.move
            if (activeOperation.positionWorkingText < 0)
                throw new Error('Cannot move beyond the start of the string')
        }
        else {
            let moveInStarting = this.move;

            if (activeOperation.isBehindWorkingText) {
                moveInStarting = Math.max(this.move - activeOperation.lengthToEndOfWorkingText, 0)
                activeOperation.positionWorkingText += this.move - moveInStarting;
            }

            if (moveInStarting > 0) {
                const oldPos = activeOperation.positionStartingText;
                const newPos = oldPos + moveInStarting;

                if (newPos > activeOperation.startingText.length)
                    throw new Error('Cannot move beyond the end of the string');

                const movedCharacters = [];
                for (let i = 0; i < moveInStarting; i++)
                    movedCharacters.push(activeOperation.startingText[oldPos + i]);

                activeOperation.positionStartingText = newPos;

                Array.prototype.splice.apply(
                    activeOperation.workingText,
                    [
                        activeOperation.positionWorkingText,
                        0,
                        ...movedCharacters
                    ]
                );

                activeOperation.positionWorkingText += moveInStarting;
            }
        }

        return activeOperation;
    }

    static canBeCreatedFrom(edit: object): boolean {
        // Extra safetey in case of being passed in through API
        if (!edit) return false;

        const move = (<any>edit).move;
        return !!(
            move === 0 ||
            move &&
            Number.isInteger(move)
        );
    }

    static createFrom(edit: object): Move | undefined {
        if (Move.canBeCreatedFrom(edit))
            return new Move((<any>edit).move);
    }
};