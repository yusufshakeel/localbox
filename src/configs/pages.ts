// ================ DO NOT CHANGE THE FOLLOWING ====================

import {
  Home,
  Upload,
  Image,
  Music,
  Video,
  File,
  MessageCircle,
  Info,
  HardDrive
} from 'lucide-react';
import {PermissionsType} from '@/types/permissions';
import {UserType} from '@/types/users';

const permissionTag = (pageId: string, permissions: string[]) => {
  return permissions.map(p => `${pageId}:${p}`);
};
export const Pages = {
  'login': {
    id: 'login',
    link: '/auth/login',
    title: 'Log in',
    pageFor: [UserType.any],
    permissions: permissionTag('login', [
      PermissionsType.PUBLIC
    ])
  },
  'home': {
    id: 'home',
    link: '/',
    title: 'Home',
    pageFor: [UserType.any],
    permissions: permissionTag('home', [
      PermissionsType.PUBLIC
    ])
  },
  'info': {
    id: 'info',
    link: '/info',
    title: 'Info',
    pageFor: [UserType.any],
    permissions: permissionTag('info', [
      PermissionsType.PUBLIC
    ])
  },
  'adminsDashboard': {
    id: 'adminsDashboard',
    link: '/admins/dashboard',
    title: 'Admins Dashboard',
    pageFor: [UserType.admin],
    permissions: permissionTag('adminsDashboard', [
      PermissionsType.ADMIN
    ])
  },
  'setup': {
    id: 'setup',
    link: '/setup',
    title: 'Setup',
    pageFor: [UserType.admin],
    permissions: permissionTag('setup', [
      PermissionsType.ADMIN
    ])
  },
  'profile': {
    id: 'profile',
    link: '/profile',
    title: 'Profile',
    pageFor: [UserType.any],
    permissions: permissionTag('profile', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'uploads': {
    id: 'uploads',
    link: '/uploads',
    title: 'Uploads',
    pageFor: [UserType.any],
    permissions: permissionTag('uploads', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'images': {
    id: 'images',
    link: '/images',
    title: 'Images',
    pageFor: [UserType.any],
    permissions: permissionTag('images', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'audios': {
    id: 'audios',
    link: '/audios',
    title: 'Audios',
    pageFor: [UserType.any],
    permissions: permissionTag('audios', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'videos': {
    id: 'videos',
    link: '/videos',
    title: 'Videos',
    pageFor: [UserType.any],
    permissions: permissionTag('videos', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'documents': {
    id: 'documents',
    link: '/documents',
    title: 'Documents',
    pageFor: [UserType.any],
    permissions: permissionTag('documents', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'tempChats': {
    id: 'tempChats',
    link: '/temp-chats',
    title: 'TempChats',
    pageFor: [UserType.any],
    permissions: permissionTag('tempChats', [
      PermissionsType.AUTHORIZED_USE,
      PermissionsType.AUTHORIZED_VIEW
    ])
  },
  'personalDrive': {
    id: 'personalDrive',
    link: '/personal-drive',
    title: 'Personal Drive',
    pageFor: [UserType.any],
    permissions: permissionTag('personalDrive', [
      PermissionsType.AUTHORIZED_USE
    ])
  },
  'unauthorized': {
    id: 'unauthorized',
    link: '/unauthorized',
    title: 'Unauthorized',
    pageFor: [UserType.any],
    permissions: permissionTag('unauthorized', [
      PermissionsType.PUBLIC
    ])
  }
};

export const HOME_PAGE = {
  icon: Home,
  title: Pages.home.title,
  link: Pages.home.link,
  permissions: Pages.home.permissions
};

export const INFO_PAGE = {
  icon: Info,
  title: Pages.info.title,
  link: Pages.info.link,
  permissions: Pages.info.permissions
};

export const PROTECTED_PAGES = [
  { icon: HardDrive, ...Pages.personalDrive },
  { icon: Upload, ...Pages.uploads },
  { icon: Image, ...Pages.images },
  { icon: Music, ...Pages.audios },
  { icon: Video, ...Pages.videos },
  { icon: File, ...Pages.documents },
  { icon: MessageCircle, ...Pages.tempChats }
];