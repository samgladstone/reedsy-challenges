import type { Express } from 'express';
import exportsRouter from './exports-router';
import importsRouter from './imports-router';

export function addRouters(app: Express): void {
    app.use('/exports', exportsRouter);
    app.use('/imports', importsRouter);
};