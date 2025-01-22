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
import {PermissionsType} from '@/types/permissions';
import {isLoggedInSessionForAdmin, isLoggedInSessionForUser} from '@/utils/permissions';
import {UserType} from '@/types/users';
import {db, ConfigsCollectionName} from '@/configs/database/configs';
import {humanReadableFileSize} from '@/utils/filesize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileUploadApiResponse>
) {
  let allowedFileSizeInBytes = 0;
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

    if (isLoggedInSessionForAdmin(session)) {
      allowedFolders.push(
        PublicFolders.audios,
        PublicFolders.videos,
        PublicFolders.images,
        PublicFolders.documents
      );
    }
    else if (isLoggedInSessionForUser(session)) {
      const permissions = session.user.permissions;

      if (permissions.includes(`${Pages.audios.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        allowedFolders.push(PublicFolders.audios);
      }

      if (permissions.includes(`${Pages.videos.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        allowedFolders.push(PublicFolders.videos);
      }

      if (permissions.includes(`${Pages.images.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        allowedFolders.push(PublicFolders.images);
      }

      if (permissions.includes(`${Pages.documents.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        allowedFolders.push(PublicFolders.documents);
      }
    }

    if (!allowedFolders.includes(dir as PublicFolders || '')) {
      return res.status(400).json({ error: 'Bad request', message: 'Invalid dir' });
    }

    const uploadsFolder = path.join(process.cwd(), `public/${dir}`);

    let uploadedFileName = '';

    let uploadLimit = {};

    if (session.user.type === UserType.user) {
      const config = await db.query.selectAsync(ConfigsCollectionName, {
        where: { key: 'FILE_UPLOAD_MAX_SIZE_IN_BYTES' }
      });
      if (config.length === 1) {
        allowedFileSizeInBytes = +config[0].value;
        uploadLimit = { limits: { fileSize: allowedFileSizeInBytes } };
      }
    }

    const upload = multer({
      ...uploadLimit,
      storage: multer.diskStorage({
        destination: uploadsFolder,
        filename: (req, file, cb) => {
          const formattedFilename = file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi,'-');
          uploadedFileName = `${getISOStringDate()}-__${session.user.username}__-${formattedFilename}`;
          cb(null, uploadedFileName);
        }
      })
    }).single('file');

    const uploadMiddleware = promisify(upload);

    await uploadMiddleware(req as any, res as any);
    return res.status(200).json({ message: 'File uploaded successfully', uploadedFileName });
  } catch (error: any) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'LIMIT_FILE_SIZE',
        message: `Uploaded file size is too large. Allowed file size: ${humanReadableFileSize(allowedFileSizeInBytes)}`
      });
    }
    return res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false // Disables Next.js's default body parser
  }
};
