import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import path from 'path';
import {PrivateFolder, PrivateFolders} from '@/configs/folders';
import fs from 'fs';
import {readdir, stat, mkdir} from 'fs/promises';
import {UserType} from '@/types/users';
import {PermissionsType} from '@/types/permissions';
import {FILE_EXTENSIONS} from '@/configs/files';
import {getFilename} from '@/utils/filename';
import {db, UsersCollectionName} from '@/configs/database/users';

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: any
) {
  if (user.type === UserType.user) {
    if (!user.personalDriveStorageLimit || +user.personalDriveStorageLimit <= 0) {
      return res.status(400).json({ error: 'Personal Drive is not configured.' });
    }
  }

  return res.status(200).json({
    userId: user.id,
    userType: user.type,
    storageLimit: user.type === UserType.admin ? -1 : +user.personalDriveStorageLimit,
    storageUsed: +user.personalDriveStorageUsed || 0
  });
}

async function getFilesHandler(
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

    const extension = path.extname(filename).toLowerCase();
    let fileType: string;

    if (FILE_EXTENSIONS.images.includes(extension)) {
      fileType = 'image';
    } else if (FILE_EXTENSIONS.videos.includes(extension)) {
      fileType = 'video';
    } else if (FILE_EXTENSIONS.audios.includes(extension)) {
      fileType = 'audio';
    } else {
      fileType = 'document';
    }

    return { filename, fileType, details: { size, birthtime } };
  });

  const sortedFiles = enrichedFiles
    .filter(({filename}) => filename !== '.')
    .sort((a, b) => {
      if (req.query.sort === 'DESC') {
        return b.filename.localeCompare(a.filename);
      } else {
        return a.filename.localeCompare(b.filename);
      }
    });

  await db.query.updateAsync(
    UsersCollectionName,
    { personalDriveStorageUsed: totalSize },
    { where: { id: user.id } }
  );

  return res.status(200).json({
    userType: user.type,
    storageLimit: user.type === UserType.admin ? -1 : user.personalDriveStorageLimit,
    totalSize,
    files: sortedFiles
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
  res.setHeader('Content-Disposition', `attachment; filename=${getFilename(filename)}`);
  res.setHeader('Content-Type', 'application/octet-stream');

  // Stream the file to the client
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: [
        `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`
      ]
    });
    if (!session) {
      return;
    }

    const {user} = session;

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

      if (req.query.fetchFiles) {
        return await getFilesHandler(req, res, personalDrivePath, user);
      }

      return await getHandler(req, res, user);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}