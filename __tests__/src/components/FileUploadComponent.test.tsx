import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import useFileUploadEffect from '@/hooks/useFileUploadEffect';
import showToast from '@/utils/show-toast';

// Mock `useFileUploadEffect`
jest.mock('../../../src/hooks/useFileUploadEffect', () => jest.fn());

// Mock `showToast`
jest.mock('../../../src/utils/show-toast', () => jest.fn());

describe('FileUploadComponent', () => {
  let mockHandleFileUpload: jest.Mock;
  let mockHandlePersonalDriveFileUpload: jest.Mock;

  beforeEach(() => {
    mockHandleFileUpload = jest.fn();
    mockHandlePersonalDriveFileUpload = jest.fn();
    (useFileUploadEffect as jest.Mock).mockReturnValue({
      file: null,
      error: null,
      handleFileUpload: mockHandleFileUpload,
      handlePersonalDriveFileUpload: mockHandlePersonalDriveFileUpload
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the component', () => {
    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*'/>);
    expect(screen.getByTestId('upload-btn')).toBeInTheDocument();
    expect(screen.getByTestId('reset-btn')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('Allows the user to select a file', () => {
    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*' />);
    const fileInput: any = screen.getByTestId('file-input');

    const testFile = new File(['test content'], 'testFile.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    expect(fileInput.files![0]).toEqual(testFile);
    expect(fileInput.files!.length).toBe(1);
  });

  it('Calls handleFileUpload when the upload button is clicked', async () => {
    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*' />);
    const fileInput: any = screen.getByTestId('file-input');
    const uploadButton: any = screen.getByTestId('upload-btn');

    const testFile = new File(['test content'], 'testFile.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockHandleFileUpload).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('Calls handlePersonalDriveFileUpload when the upload button is clicked for personal drive', async () => {
    render(
      <FileUploadComponent
        setLastUploadAt={jest.fn()}
        dir='uploads'
        acceptFileType='*'
        isPersonalDriveFileUpload={true}
      />
    );

    const fileInput: any = screen.getByTestId('file-input');
    const uploadButton: any = screen.getByTestId('upload-btn');

    const testFile = new File(['test content'], 'testFile.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockHandlePersonalDriveFileUpload).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('Resets the file input when the reset button is clicked', () => {
    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*' />);
    const fileInput: any = screen.getByTestId('file-input');
    const resetButton: any = screen.getByTestId('reset-btn');

    const testFile = new File(['test content'], 'testFile.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    fireEvent.click(resetButton);

    expect(fileInput.value).toBe('');
  });

  it('Shows a success toast when the file is uploaded successfully', async () => {
    (useFileUploadEffect as jest.Mock).mockReturnValue({
      file: { name: 'testFile.txt' },
      error: null,
      handleFileUpload: mockHandleFileUpload
    });

    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*' />);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        type: 'success',
        content: 'File uploaded',
        autoClose: 1000
      });
    });
  });

  it('Shows an error toast if there is an error during upload', async () => {
    (useFileUploadEffect as jest.Mock).mockReturnValue({
      file: null,
      error: 'Upload failed',
      handleFileUpload: mockHandleFileUpload
    });

    render(<FileUploadComponent setLastUploadAt={jest.fn()} dir='uploads' acceptFileType='*' />);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        type: 'error',
        content: 'Upload failed'
      });
    });
  });
});
