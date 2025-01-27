import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import path from 'path';
import {PrivateFolder, PrivateFolders} from '@/configs/folders';
import {db, UsersCollectionName} from '@/configs/database/users';
import fs from 'fs';
import {readdir, stat, mkdir} from 'fs/promises';
import {UserStatus, UserType} from '@/types/users';
import multer from 'multer';
import {getISOStringDate} from '@/utils/date';
import {promisify} from 'util';
import {PermissionsType} from '@/types/permissions';
import {humanReadableFileSize} from '@/utils/filesize';

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  personalDrivePath: string,
  user: any
) {
  const files = await readdir(personalDrivePath);

  const filesDetails = await Promise.all(
    files.map(file => stat(path.join(personalDrivePath, file)))
  );

  let totalSize = 0;

  const enrichedFiles = files.map((filename, index) => {
    const {size, birthtime} = filesDetails[index];
    totalSize += size;
    return { filename, details: { size, birthtime } };
  });

  return res.status(200).json({
    userType: user.type,
    storageLimit: user.type === UserType.admin ? -1 : user.personalDriveStorageLimit,
    totalSize,
    files: enrichedFiles
  });
}

async function downloadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  personalDrivePath: string,
  filename: string
) {
  const filePath = path.join(personalDrivePath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Set headers for file download
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'application/octet-stream');

  // Stream the file to the client
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  personalDrivePath: string,
  user: any
) {
  let allowedFileSizeInBytes = 0;
  try {
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
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.POST];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods, permissions: Pages.personalDrive.permissions
    });
    if (!session) {
      return;
    }

    const users = await db.query.selectAsync(
      UsersCollectionName,
      { where: { id: session.user.id, status: UserStatus.active } }
    );
    if (users.length !== 1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

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

    // create folder, if not exists
    await mkdir(personalDrivePath, { recursive: true });

    if (req.method === HttpMethod.GET) {
      if (req.query.downloadFilename) {
        const filename = req.query.downloadFilename;
        if (!filename || Array.isArray(filename)) {
          return res.status(400).json({ error: 'Invalid filename' });
        }
        return await downloadHandler(req, res, personalDrivePath, filename);
      }

      return await getHandler(req, res, personalDrivePath, user);
    }

    if (req.method === HttpMethod.POST) {
      return await postHandler(req, res, personalDrivePath, user);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}

export const config = {
  api: {
    bodyParser: false // Disables Next.js default body parser
  }
};