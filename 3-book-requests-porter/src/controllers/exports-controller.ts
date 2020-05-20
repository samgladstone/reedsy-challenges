import { Request, Response } from 'express';
import { exportJobService, exportTypes, ExportTypes } from '../service';

export function getExportsList(req: Request, res: Response): void {
    res.json(exportJobService.listJobsByState());
};

export function postExport(req: Request, res: Response): void {
    const { bookId, type }: { bookId: string, type: ExportTypes } = req.body;

    if (!bookId || typeof bookId !== 'string')
        res.status(400).send('A book ID is required');

    else if (!type)
        res.status(400).send('An export type is required');

    else if (exportTypes.indexOf(type) === -1)
        res.status(400).send('This export type is not supported');

    else {
        const job = exportJobService.add(bookId, type);
        res.json(job);
    }
};