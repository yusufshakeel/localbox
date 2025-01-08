// ================ DO NOT CHANGE THE FOLLOWING ====================
import {Home, Upload, Image, Music, Video, File, MessageCircle, Info, User, SlidersHorizontal} from 'lucide-react';
import {PermissionsType} from '@/types/permissions';

const permissionTag = (pageId: string, permissions: string[]) => {
  return permissions.map(p => `${pageId}:${p}`);
};
export const Pages = {
  'home': {
    id: 'home',
    link: '/',
    title: 'Home',
    permissions: []
  },
  'info': {
    id: 'info',
    link: '/info',
    title: 'Info',
    permissions: []
  },
  'adminsDashboard': {
    id: 'adminsDashboard',
    link: '/admins/dashboard',
    title: 'Admins Dashboard',
    permissions: [
      PermissionsType.ADMIN
    ]
  },
  'profile': {
    id: 'profile',
    link: '/profile',
    title: 'Profile',
    permissions: permissionTag('profile', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'uploads': {
    id: 'uploads',
    link: '/uploads',
    title: 'Uploads',
    permissions: permissionTag('uploads', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'images': {
    id: 'images',
    link: '/images',
    title: 'Images',
    permissions: permissionTag('images', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'audios': {
    id: 'audios',
    link: '/audios',
    title: 'Audios',
    permissions: permissionTag('audios', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'videos': {
    id: 'videos',
    link: '/videos',
    title: 'Videos',
    permissions: permissionTag('videos', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'documents': {
    id: 'documents',
    link: '/documents',
    title: 'Documents',
    permissions: permissionTag('documents', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'tempChats': {
    id: 'tempChats',
    link: '/temp-chats',
    title: 'TempChats',
    permissions: permissionTag('tempChats', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  }
};

export const COMMON_PAGES = [
  {icon: Home, title: Pages.home.title, link: Pages.home.link},
  {icon: Upload, title: Pages.uploads.title, link: Pages.uploads.link},
  {icon: Image, title: Pages.images.title, link: Pages.images.link},
  {icon: Music, title: Pages.audios.title, link: Pages.audios.link},
  {icon: Video, title: Pages.videos.title, link: Pages.videos.link},
  {icon: File, title: Pages.documents.title, link: Pages.documents.link},
  {icon: MessageCircle, title: Pages.tempChats.title, link: Pages.tempChats.link},
  {icon: Info, title: Pages.info.title, link: Pages.info.link}
];

export const LOGGED_IN_USER_PAGES = [
  {icon: User, title: Pages.profile.title, link: Pages.profile.link}
];

export const LOGGED_IN_ADMIN_PAGES = [
  {icon: SlidersHorizontal, title: Pages.adminsDashboard.title, link: Pages.adminsDashboard.link}
];