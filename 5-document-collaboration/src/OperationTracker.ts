export default class OperationTracker {
    // I figure that working with directly with strings is not great due to them being immutable.
    //
    // Alternatively, we could split the characters into an array and work with that, but we start
    //      at the beginning of the text and work our way in, so the array operations are going to be
    //      near the beginning of the array, which seems unecessarily heavy
    //
    // So, I have setteled on building out the array as we go,

    /** The text that the operation is being applied to */
    readonly startingText: string;
    /** The current position in the starting text  */
    positionStartingText: number;
    /** The working copy of the text */
    readonly workingText: string[];
    /** The current position in the builtCharacters (we could move backwards and so be editing inside our built text) */
    positionWorkingText: number;

    constructor(startingText: string) {
        this.startingText = startingText;
        this.positionStartingText = 0;
        this.workingText = [];
        this.positionWorkingText = 0;
    }

    get isBehindWorkingText(): boolean {
        return this.positionWorkingText < this.workingText.length;
    }

    get lengthToEndOfWorkingText(): number {
        const pos = this.positionWorkingText;
        const len = this.workingText.length;

        if (pos > len)
            throw new Error('Internal State Error: The position in the working text cannot be beyond the end of the working text');

        return len - pos;
    }

    /** A string copy of the working text */
    get text(): string {
        return this.workingText.join('') + this.startingText.substr(this.positionStartingText);
    }
}