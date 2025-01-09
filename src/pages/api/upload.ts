import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import {FileUploadApiResponse} from '@/types/api-responses';
import {PublicFolders} from '@/configs/folders';
import {getISOStringDate} from '@/utils/date';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {UserType} from '@/types/users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileUploadApiResponse>
) {
  try {
    const allowedMethods = [HttpMethod.POST];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: [
        ...Pages.uploads.permissions
      ]
    });
    if (!session) {
      return;
    }

    const dir = req.query.dir || PublicFolders.uploads;
    const allowedFolders = [PublicFolders.uploads, PublicFolders.tempChats];

    if (session.user.type === UserType.admin) {
      allowedFolders.push(
        PublicFolders.audios,
        PublicFolders.videos,
        PublicFolders.images,
        PublicFolders.documents
      );
    }

    if (!allowedFolders.includes(dir as PublicFolders || '')) {
      return res.status(400).json({ error: 'Bad request', message: 'Invalid dir' });
    }

    const uploadsFolder = path.join(process.cwd(), `public/${dir}`);

    let uploadedFileName = '';

    const upload = multer({
      storage: multer.diskStorage({
        destination: uploadsFolder,
        filename: (req, file, cb) => {
          uploadedFileName = `${getISOStringDate()}-${file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi,'-')}`;
          cb(null, uploadedFileName);
        }
      })
    }).single('file');

    const uploadMiddleware = promisify(upload);

    await uploadMiddleware(req as any, res as any);
    return res.status(200).json({ message: 'File uploaded successfully', uploadedFileName });
  } catch (error: any) {
    return res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false // Disables Next.js's default body parser
  }
};
