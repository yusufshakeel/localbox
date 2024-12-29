// ================ DO NOT CHANGE THE FOLLOWING ====================
import {
  faFile,
  faHome,
  faImage,
  faCircleInfo,
  faMessage,
  faMusic,
  faUpload,
  faVideo,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export const defaultPages = {
  uploads: { id: 'uploads', link: '/uploads' },
  images: { id: 'images', link: '/images' },
  audios: { id: 'audios', link: '/audios' },
  videos: { id: 'videos', link: '/videos' },
  documents: { id: 'documents', link: '/documents' },
  tempChats: { id: 'temp-chats', link: '/temp-chats' },
  info: { id: 'info', link: '/info' },
  profile: { id: 'profile', link: '/profile' },
  login: { id: 'login', link: '/login' }
};

export const pages = [
  {icon: faHome, title: 'Home', link: '/', hideOnHomePage: true},
  {icon: faUpload, title: 'Uploads', link: defaultPages.uploads.link},
  {icon: faImage, title: 'Images', link: defaultPages.images.link},
  {icon: faMusic, title: 'Audios', link: defaultPages.audios.link},
  {icon: faVideo, title: 'Videos', link: defaultPages.videos.link},
  {icon: faFile, title: 'Documents', link: defaultPages.documents.link},
  {icon: faMessage, title: 'TempChats', link: defaultPages.tempChats.link},
  {icon: faCircleInfo, title: 'Info', link: defaultPages.info.link, hideOnHomePage: true},
  {icon: faUser, title: 'Profile', link: defaultPages.profile.link, hideOnHomePage: true}
];

export const PAGE_PERMISSIONS_FILENAME = 'page_permissions';