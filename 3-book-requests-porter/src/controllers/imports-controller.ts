import { Request, Response } from 'express';

export function getImportList(req: Request, resp: Response, next: Function): void {
    resp.send();
};

export function postImport(req: Request, resp: Response, next: Function): void {
    resp.send();
};