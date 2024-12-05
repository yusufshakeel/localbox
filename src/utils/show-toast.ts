import {toast} from 'react-toastify';

type ConfigType = {
    content: string;
    type: 'success' | 'error',
    position?: 'top-center' | 'top-right' | 'top-left';
    autoClose?: number;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    progress?: string;
    theme?: 'light';
};

export default function showToastHelper({
  content,
  type,
  position = 'top-center',
  autoClose = 5000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover= true,
  draggable = true,
  progress = undefined,
  theme = 'light'
}: ConfigType) {

  const options = {
    position,
    autoClose,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    progress,
    theme
  }

  switch (type) {
  case 'success':
    toast.success(content, options);
    break;
  case 'error':
    toast.error(content, options);
    break;
  }
}