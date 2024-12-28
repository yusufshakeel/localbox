export const ROLES = {
  admin: [
    'create:*',
    'view:*',
    'update:*',
    'delete:*'
  ],
  user: [
    'uploads:view',
    'uploads:upload',
    'images:view',
    'audios:view',
    'videos:view',
    'documents:view',
    'tempChats:use'
  ]
};

