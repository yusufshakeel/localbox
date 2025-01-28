import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';
import {FileUploadApiResponse} from '@/types/api-responses';
import {PrivateFolder, PrivateFolders, PublicFolders} from '@/configs/folders';
import {getISOStringDate} from '@/utils/date';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {PermissionsType} from '@/types/permissions';
import {isLoggedInSessionForAdmin, isLoggedInSessionForUser} from '@/utils/permissions';
import {UserType} from '@/types/users';
import {db, ConfigsCollectionName} from '@/configs/database/configs';
import {humanReadableFileSize} from '@/utils/filesize';
import {readdir, stat} from 'fs/promises';

async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  let allowedFileSizeInBytes = 0;

  try {
    const dir = req.query.dir || PublicFolders.uploads;
    const allowedFolders = [PublicFolders.uploads, PublicFolders.tempChats];

    if (isLoggedInSessionForAdmin(session)) {
      allowedFolders.push(
        PublicFolders.audios,
        PublicFolders.videos,
        PublicFolders.images,
        PublicFolders.documents
      );
    } else if (isLoggedInSessionForUser(session)) {
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
      return res.status(400).json({error: 'Bad request', message: 'Invalid dir'});
    }

    const uploadsFolder = path.join(process.cwd(), `public/${dir}`);

    let uploadedFileName = '';

    let uploadLimit = {};

    if (session.user.type === UserType.user) {
      try {
        const config = await db.query.selectAsync(ConfigsCollectionName, {
          where: {key: 'FILE_UPLOAD_MAX_SIZE_IN_BYTES'}
        });
        if (config.length === 1) {
          allowedFileSizeInBytes = +config[0].value;
          uploadLimit = {limits: {fileSize: allowedFileSizeInBytes}};
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // do nothing
      }
    }

    const upload = multer({
      ...uploadLimit,
      storage: multer.diskStorage({
        destination: uploadsFolder,
        filename: (req, file, cb) => {
          const formattedFilename = file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi, '-');
          uploadedFileName = `${getISOStringDate()}-__${session.user.username}__-${formattedFilename}`;
          cb(null, uploadedFileName);
        }
      })
    }).single('file');

    const uploadMiddleware = promisify(upload);

    await uploadMiddleware(req as any, res as any);
    return res.status(200).json({message: 'File uploaded successfully', uploadedFileName});
  } catch (error: any) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'LIMIT_FILE_SIZE',
        message: `Allowed file size: ${humanReadableFileSize(allowedFileSizeInBytes)}`
      });
    }
    return res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}

async function personalDriveUploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  let allowedFileSizeInBytes = 0;

  try {
    const {user} = session;

    if (user.type === UserType.user) {
      if (!user.personalDriveStorageLimit) {
        return res.status(401).json({
          error: 'Personal Drive is not configured.'
        });
      }
      if (!user.permissions.includes(`${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        return res.status(401).json({
          error: 'You do not have required permissions.'
        });
      }
    }
    const personalDrivePath = path.join(
      process.cwd(), PrivateFolder, PrivateFolders.personalDrive, user.id
    );

    const files = await readdir(personalDrivePath);

    const filesDetails = await Promise.all(
      files.map(file => stat(path.join(personalDrivePath, file)))
    );

    const totalSize = filesDetails.reduce((acc, curr) => {
      return acc + curr.size;
    }, 0);

    let uploadLimit = {};

    if (user.type === UserType.user) {
      if (+user.personalDriveStorageLimit - totalSize <= 0) {
        return res.status(400).json({
          error: 'You do not have enough free space.'
        });
      } else {
        allowedFileSizeInBytes = +user.personalDriveStorageLimit - totalSize;
        uploadLimit = { limits: { fileSize: allowedFileSizeInBytes } };
      }
    }

    let uploadedFileName = '';

    const upload = multer({
      ...uploadLimit,
      storage: multer.diskStorage({
        destination: personalDrivePath,
        filename: (req, file, cb) => {
          const formattedFilename = file.originalname.replace(/[^a-z0-9.]|\s+/gmi, '-').replace(/-{2,}/gmi, '-');
          uploadedFileName = `${getISOStringDate()}-__${user.username}__-${formattedFilename}`;
          cb(null, uploadedFileName);
        }
      })
    }).single('file');

    const uploadMiddleware = promisify(upload);

    await uploadMiddleware(req as any, res as any);
    return res.status(200).json({message: 'File uploaded successfully', uploadedFileName});
  } catch (error: any) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'LIMIT_FILE_SIZE',
        message: `Allowed file size: ${humanReadableFileSize(allowedFileSizeInBytes)}`
      });
    }
    return res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileUploadApiResponse>
) {
  try {
    const allowedMethods = [HttpMethod.POST];
    let requiredPermissions: string[] = [];
    if (req.query.isPersonalDriveFileUpload) {
      requiredPermissions = [
        `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`
      ];
    } else if (req.query.dir) {
      const pageId = Pages[req.query.dir as keyof typeof Pages].id;
      requiredPermissions = [
        `${pageId}:${PermissionsType.AUTHORIZED_USE}`
      ];
    }

    const session = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: requiredPermissions
    });
    if (!session) {
      return;
    }

    if (req.query.isPersonalDriveFileUpload) {
      return await personalDriveUploadHandler(req, res, session);
    } else {
      return await uploadHandler(req, res, session);
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false // Disables Next.js's default body parser
  }
};
