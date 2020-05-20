import { Request, Response } from 'express';
import { importJobService, importTypes, ImportTypes } from '../service';

export function getImportList(req: Request, res: Response): void {
    res.json(importJobService.listJobsByState());
};

export function postImport(req: Request, res: Response): void {
    const { bookId, type, url }: { bookId: string, type: ImportTypes, url: string } = req.body;

    if (!bookId || typeof bookId !== 'string')
        res.status(400).send('A book ID is required');

    else if (!url || typeof url !== 'string')
        res.status(400).send('A url is required');

    else if (!type)
        res.status(400).send('An import type is required');

    else if (importTypes.indexOf(type) === -1)
        res.status(400).send('This import type is not supported');

    else {
        const job = importJobService.add(bookId, type, url);
        res.json(job);
    }
};