import { Request, Response } from 'express';

export function getExportsList(req: Request, resp: Response, next: Function): void {
    resp.send();
};

export function postExport(req: Request, resp: Response, next: Function): void {
    resp.send();
};