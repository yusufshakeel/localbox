import type { NextApiRequest, NextApiResponse } from 'next';
import { readdir, access, unlink, rename } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import {PrivateFolder, PrivateFolders, PublicFolder, PublicFolders} from '@/configs/folders';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {UserType} from '@/types/users';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {getFilename, getUsernameFromFilename} from '@/utils/filename';
import mime from 'mime-types';

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  if (!req.body?.dir) {
    return res.status(400).json({ error: 'Bad request', message: 'dir is required' });
  }
  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'filename is required' });
  }

  if (session.user.type === UserType.user) {
    const pageId = Pages[req.body.dir as keyof typeof Pages].id;
    const userHasPermissions = hasPermissions(
      session,
      [ `${pageId}:${PermissionsType.AUTHORIZED_USE}` ]
    );

    if (!userHasPermissions) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete files'
      });
    }

    if (getUsernameFromFilename(req.body?.filename) !== session.user.username) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete this file'
      });
    }
  }

  const filepath = path.join(process.cwd(), 'public', req.body.dir, req.body.filename);
  await access(filepath);
  await unlink(filepath);

  return res.status(200).json({ message: 'File deleted successfully.' });
}

async function renameFilesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  if (!req.body?.dir) {
    return res.status(400).json({ error: 'Bad request', message: 'dir is required' });
  }

  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'filename is required' });
  }

  if (!req.body?.newFilename || !req.body.newFilename.trim().length) {
    return res.status(400).json({ error: 'Bad request', message: 'newFilename is required' });
  }

  if (session.user.type === UserType.user) {
    const pageId = Pages[req.body.dir as keyof typeof Pages].id;
    const userHasPermissions = hasPermissions(
      session,
      [ `${pageId}:${PermissionsType.AUTHORIZED_USE}` ]
    );

    if (!userHasPermissions) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to rename files'
      });
    }

    if (getUsernameFromFilename(req.body?.filename) !== session.user.username) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to rename this file'
      });
    }
  }

  const dirPath = path.join(process.cwd(), 'public', req.body.dir);

  const currentFilePrefix = req.body.filename.split(getFilename(req.body.filename))[0];
  const newFilename = `${currentFilePrefix}${req.body.newFilename.trim()}`;

  const oldPath = path.join(dirPath, req.body.filename);
  const newPath = path.join(dirPath, newFilename);

  await rename(oldPath, newPath);
  return res.status(200).json({ message: 'File renamed successfully'  });
}

async function renamePersonalDriveFilesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'filename is required' });
  }

  if (!req.body?.newFilename || !req.body.newFilename.trim().length) {
    return res.status(400).json({ error: 'Bad request', message: 'newFilename is required' });
  }

  if (session.user.type === UserType.user) {
    const userHasPermissions = hasPermissions(
      session,
      [ `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}` ]
    );

    if (!userHasPermissions) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to rename files'
      });
    }

    if (getUsernameFromFilename(req.body?.filename) !== session.user.username) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to rename this file'
      });
    }
  }

  const personalDrivePath = path.join(
    process.cwd(), PrivateFolder, PrivateFolders.personalDrive, session.user.id
  );

  const currentFilePrefix = req.body.filename.split(getFilename(req.body.filename))[0];
  const newFilename = `${currentFilePrefix}${req.body.newFilename.trim()}`;

  const oldPath = path.join(personalDrivePath, req.body.filename);
  const newPath = path.join(personalDrivePath, newFilename);

  await rename(oldPath, newPath);
  return res.status(200).json({ message: 'File renamed successfully'  });
}

async function deletePersonalDriveFilesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  if (!req.body?.filename) {
    return res.status(400).json({ error: 'Bad request', message: 'filename is required' });
  }

  if (session.user.type === UserType.user) {
    const userHasPermissions = hasPermissions(
      session,
      [ `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}` ]
    );

    if (!userHasPermissions) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete files'
      });
    }

    if (getUsernameFromFilename(req.body?.filename) !== session.user.username) {
      return res.status(400).json({
        error: 'Bad request', message: 'You do not have permissions to delete this file'
      });
    }
  }

  const personalDrivePath = path.join(
    process.cwd(), PrivateFolder, PrivateFolders.personalDrive, session.user.id
  );

  const filepath = path.join(personalDrivePath, req.body.filename);
  await access(filepath);
  await unlink(filepath);

  return res.status(200).json({ message: 'File deleted successfully.' });
}

async function downloadFileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filename = req.query.downloadFilename as string;
  const dir = req.query.dir as string;
  const filePath = path.join(process.cwd(), PublicFolder, dir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  if (req.query.stream) {
    // Set headers for file streaming
    const contentType = mime.contentType(filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range && contentType !== false) {
      // serving chunk size file
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const megabyte = 10e6;
      const CHUNK_SIZE = fileSize >= 10 * megabyte ? 8 * megabyte : 4 * megabyte;
      const end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      // serving full file
      res.writeHead(200, {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize,
        'Content-Type': 'application/octet-stream'
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${getFilename(filename)}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allowedFolders = [
    PublicFolders.uploads,
    PublicFolders.audios,
    PublicFolders.videos,
    PublicFolders.images,
    PublicFolders.documents
  ];
  if (!allowedFolders.includes(req.query?.dir as PublicFolders || '')) {
    return res.status(400).json({ error: 'Bad request', message: 'Invalid dir' });
  }

  const folderPath = path.join(process.cwd(), `public/${req.query.dir}`); // Replace with your folder path
  const files = await readdir(folderPath); // Get the list of files
  const filteredFiles = req.query.sort === 'DESC'
    ? files.filter(f => f[0] !== '.').sort((a, b) => b.localeCompare(a))
    : files.filter(f => f[0] !== '.').sort((a, b) => a.localeCompare(b));

  return res.status(200).json({ files: filteredFiles });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.DELETE, HttpMethod.PATCH];

    let requiredPermissions: string[] = [];

    if (req.method === HttpMethod.GET) {
      let pageId = '';
      if (req.query.dir === PublicFolders.tempChats) {
        pageId = Pages.tempChats.id;
      } else {
        pageId = Pages[req.query.dir as keyof typeof Pages].id;
      }
      requiredPermissions = [
        `${pageId}:${PermissionsType.AUTHORIZED_VIEW}`
      ];
    } else if (req.method === HttpMethod.DELETE) {
      if (req.body.isPersonalDriveFileDelete) {
        requiredPermissions = [
          `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`
        ];
      } else {
        const pageId = Pages[req.body.dir as keyof typeof Pages].id;
        requiredPermissions = [
          `${pageId}:${PermissionsType.AUTHORIZED_USE}`
        ];
      }
    } else if (req.method === HttpMethod.PATCH) {
      if (req.body.isPersonalDriveFileDelete) {
        requiredPermissions = [
          `${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`
        ];
      } else {
        const pageId = Pages[req.body.dir as keyof typeof Pages].id;
        requiredPermissions = [
          `${pageId}:${PermissionsType.AUTHORIZED_USE}`
        ];
      }
    }

    const session = await hasApiPrivileges(req, res, {
      allowedMethods,
      permissions: requiredPermissions
    });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      if (req.query.downloadFilename && req.query.dir) {
        return await downloadFileHandler(req, res);
      }
      return await getHandler(req, res);
    }

    if (req.method === HttpMethod.DELETE) {
      if (req.body.isPersonalDriveFileDelete) {
        return await deletePersonalDriveFilesHandler(req, res, session);
      } else {
        return await deleteHandler(req, res, session);
      }
    }

    if (req.method === HttpMethod.PATCH) {
      if (req.body.isPersonalDriveFileDelete && req.query.action === 'renameFile') {
        return await renamePersonalDriveFilesHandler(req, res, session);
      } else if (req.query.action === 'renameFile') {
        return await renameFilesHandler(req, res, session);
      }
    }

    return res.status(400).json({ error: 'No handler' });
  } catch (error: any) {
    res.status(500).json({ error: 'Something went wrong', message: error.message });
  }
}
