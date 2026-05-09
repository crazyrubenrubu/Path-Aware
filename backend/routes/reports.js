import express from 'express';
import { getAllReports, createReport, createReportFromImage } from '../controllers/reportController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllReports);
router.post('/', createReport);
router.post('/with-image', upload.single('image'), createReportFromImage);

export default router;