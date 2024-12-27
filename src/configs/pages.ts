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

export const pages = [
  {icon: faHome, title: 'Home', link: '/', hideOnHomePage: true},
  {icon: faUpload, title: 'Uploads', link: '/uploads'},
  {icon: faImage, title: 'Images', link: '/images'},
  {icon: faMusic, title: 'Audios', link: '/audios'},
  {icon: faVideo, title: 'Videos', link: '/videos'},
  {icon: faFile, title: 'Documents', link: '/documents'},
  {icon: faMessage, title: 'TempChats', link: '/temp-chats'},
  {icon: faCircleInfo, title: 'Info', link: '/info', hideOnHomePage: true},
  {icon: faUser, title: 'Profile', link: '/profile', hideOnHomePage: true}
];