import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {db, UsersCollectionName} from '@/configs/database/users';
import path from 'path';
import {PrivateFolder, PrivateFolders} from '@/configs/folders';
import {readdir, rm} from 'fs/promises';

async function getOrphanedDirectories() {
  const users: {id: string}[] = await db.query.selectAsync(
    UsersCollectionName,
    { attributes: ['id'] }
  );

  const userDirectories = users.map(({id}) => id);

  const personalDrivePath = path.join(process.cwd(), PrivateFolder, PrivateFolders.personalDrive);

  const items = await readdir(personalDrivePath, { withFileTypes: true });

  const directories = items
    .filter((item) => item.isDirectory())
    .map((dir) => dir.name);

  return directories.filter(dir => {
    return !userDirectories.includes(dir);
  });
}

async function deleteOrphanedPersonalDriveDirectoriesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body?.directories) {
    return res.status(400).json({ error: 'Bad request', message: 'directories field id required' });
  }

  const directories = await getOrphanedDirectories();

  try {
    const personalDrivePath = path.join(process.cwd(), PrivateFolder, PrivateFolders.personalDrive);

    for (const dir of req.body.directories) {
      if (directories.includes(dir)) {
        const dirPath = path.join(personalDrivePath, dir);
        await rm(dirPath, { recursive: true, force: true });
        // eslint-disable-next-line
        console.log(
          `[personalDrive][deleteOrphanedPersonalDriveDirectoriesHandler] Deleted Personal Drive directory: ${dir}`
        );
      }
    }

    return res.status(200).json({ message: 'Cleanup done' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, message: 'Something went wrong' });
  }
}

async function getOrphanedPersonalDriveDirectoriesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const directoriesToDelete = await getOrphanedDirectories();
  return res.status(200).json({
    directories: directoriesToDelete
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.DELETE];
    const session = await hasAdminApiPrivileges(req, res, {allowedMethods});
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      if (req.query.action === 'orphanedPersonalDriveDirectories') {
        return await getOrphanedPersonalDriveDirectoriesHandler(req, res);
      }
    }

    if (req.method === HttpMethod.DELETE) {
      if (req.query.action === 'orphanedPersonalDriveDirectories') {
        return await deleteOrphanedPersonalDriveDirectoriesHandler(req, res);
      }
    }

    return res.status(400).json({ error: 'No handler' });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}