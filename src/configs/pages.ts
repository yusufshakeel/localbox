// ================ DO NOT CHANGE THE FOLLOWING ====================
import {Home, Upload, Image, Music, Video, File, MessageCircle, Info, User, SlidersHorizontal} from 'lucide-react';

export const PAGES = [
  {icon: Home, title: 'Home', link: '/'},
  {icon: Upload, title: 'Uploads', link: '/uploads'},
  {icon: Image, title: 'Images', link: '/images'},
  {icon: Music, title: 'Audios', link: '/audios'},
  {icon: Video, title: 'Videos', link: '/videos'},
  {icon: File, title: 'Documents', link: '/documents'},
  {icon: MessageCircle, title: 'TempChats', link: '/temp-chats'},
  {icon: Info, title: 'Info', link: '/info'}
];

export const LOGGED_IN_USER_PAGES = [
  {icon: User, title: 'Profile', link: '/profile'}
];

export const LOGGED_IN_ADMIN_PAGES = [
  {icon: SlidersHorizontal, title: 'Admin Dashboard', link: '/admin/dashboard'}
];