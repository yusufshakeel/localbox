import {
  faFile,
  faHome,
  faImage,
  faInfo,
  faMessage,
  faMusic,
  faUpload,
  faVideo
} from '@fortawesome/free-solid-svg-icons';

export const pages = [
  {icon: faHome, title: 'Home', link: '/', hideOnHomePage: true},
  {icon: faUpload, title: 'Uploads', link: '/uploads'},
  {icon: faImage, title: 'Images', link: '/images'},
  {icon: faMusic, title: 'Audios', link: '/audios'},
  {icon: faVideo, title: 'Videos', link: '/videos'},
  {icon: faFile, title: 'Documents', link: '/documents'},
  {icon: faMessage, title: 'TempChats', link: '/temp-chats'},
  {icon: faInfo, title: 'Info', link: '/info', hideOnHomePage: true}
]