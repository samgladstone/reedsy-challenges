import express from 'express';
import { getExportsList, postExport } from '../controllers/exports-controller';

const exportsRouter = express.Router();

exportsRouter.route('/')
    .get(getExportsList)
    .post(postExport);

export default exportsRouter;