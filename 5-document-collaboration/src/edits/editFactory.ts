// import Edit from './Edit';
import Delete from './Delete';
import Insert from './Insert';
import Move from './Move';

type Edit = Delete | Insert | Move;

export default function (edit: object): Edit | undefined {
    if (edit instanceof Delete ||
        edit instanceof Insert ||
        edit instanceof Move)
        return edit;

    const deleteEdit = Delete.createFrom(edit);
    if (deleteEdit) return deleteEdit;

    const insertEdit = Insert.createFrom(edit);
    if (insertEdit) return insertEdit;

    const moveEdit = Move.createFrom(edit)
    if (moveEdit) return moveEdit;
}