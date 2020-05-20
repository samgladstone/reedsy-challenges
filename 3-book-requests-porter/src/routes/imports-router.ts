import express from 'express';
import { getImportList, postImport } from '../controllers/imports-controller';

const importsRouter = express.Router();

importsRouter.route('/')
    .get(getImportList)
    .post(postImport);

export default importsRouter;