// showToast.test.js
import { toast } from 'react-toastify';
import showToast from '@/utils/show-toast';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Testing show toast util', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should call toast.success with the correct options', () => {
    const config: any = {
      content: 'Operation successful',
      type: 'success',
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: 'light'
    };

    showToast(config);

    expect(toast.success).toHaveBeenCalledWith('Operation successful', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light'
    });
  });

  it('Should call toast.error with the correct options', () => {
    const config: any = {
      content: 'Something went wrong',
      type: 'error',
      position: 'top-left',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light'
    };

    showToast(config);

    expect(toast.error).toHaveBeenCalledWith('Something went wrong', {
      position: 'top-left',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
  });

  it('Should use default options when optional fields are not provided', () => {
    const config: any = {
      content: 'Default options test',
      type: 'success'
    };

    showToast(config);

    expect(toast.success).toHaveBeenCalledWith('Default options test', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
  });
});