// ================ DO NOT CHANGE THE FOLLOWING ====================
import {Home, Upload, Image, Music, Video, File, MessageCircle, Info, User, SlidersHorizontal} from 'lucide-react';
import {PermissionsType} from '@/types/permissions';

const pagesCommonFields = {
  permissions: [PermissionsType.AUTHORIZED_VIEW, PermissionsType.AUTHORIZED_USE]
};
export const Pages = {
  'home': {
    link: '/',
    title: 'Home',
    ...pagesCommonFields,
    permissions: [
      PermissionsType.AUTHORIZED_VIEW,
      PermissionsType.UNAUTHORIZED_VIEW
    ]
  },
  'info': {
    link: '/info',
    title: 'Info',
    ...pagesCommonFields,
    permissions: [
      PermissionsType.AUTHORIZED_VIEW,
      PermissionsType.UNAUTHORIZED_VIEW
    ]
  },
  'adminDashboard': {
    link: '/admin/dashboard',
    title: 'Admin Dashboard',
    ...pagesCommonFields,
    permissions: [
      PermissionsType.ADMIN
    ]
  },
  'profile': { link: '/profile', title: 'Profile', ...pagesCommonFields },
  'uploads': { link: '/uploads', title: 'Uploads', ...pagesCommonFields },
  'images': { link: '/images', title: 'Images', ...pagesCommonFields },
  'audios': { link: '/audios', title: 'Audios', ...pagesCommonFields },
  'videos': { link: '/videos', title: 'Videos', ...pagesCommonFields },
  'documents': { link: '/documents', title: 'Documents', ...pagesCommonFields },
  'tempChats': { link: '/temp-chats', title: 'TempChats', ...pagesCommonFields }
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
  {icon: SlidersHorizontal, title: Pages.adminDashboard.title, link: Pages.adminDashboard.link}
];