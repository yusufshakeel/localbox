import showToast from '@/utils/show-toast';
import {useEffect, useRef, useState} from 'react';
import useFileUploadEffect from '@/hooks/useFileUploadEffect';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {getISOStringDate} from '@/utils/date';
import {AcceptFileType} from '@/types/file';
import {humanReadableFileSize} from '@/utils/filesize';

type PropType = {
  dir: string,
  acceptFileType: string
  setLastUploadAt?: (_: string) => void
  allowedFileSizeInBytes?: number
}

export default function FileUploadComponent({
  setLastUploadAt,
  dir,
  acceptFileType = AcceptFileType.any,
  allowedFileSizeInBytes
}: PropType
) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {file, handleFileUpload, error, progress} = useFileUploadEffect({ dir });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);

      if (allowedFileSizeInBytes && e.target.files[0].size > allowedFileSizeInBytes) {
        setErrorMessage(
          `File size: ${humanReadableFileSize(e.target.files[0].size)}. Allowed file size: ${humanReadableFileSize(allowedFileSizeInBytes)}`
        );
      }
    }
  };

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (allowedFileSizeInBytes && selectedFile && selectedFile.size > allowedFileSizeInBytes) {
      return;
    }
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await handleFileUpload(formData);
    }
  };

  useEffect(() => {
    if (error) {
      showToast({ type: 'error', content: error});
    } else if (file) {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setSelectedFile(null);
      setLastUploadAt?.(getISOStringDate());
      showToast({ type: 'success', content: 'File uploaded', autoClose: 1000});
    }
  }, [file, error, setLastUploadAt]);

  return (
    <div>
      <Input className="mb-3"
        type="file"
        ref={inputRef}
        name="file"
        data-testid="file-input"
        accept={acceptFileType}
        onChange={handleFileChange} />
      <div>
        <Button variant="default" className="mr-3" data-testid="upload-btn" onClick={handleUpload}>
          Upload
        </Button>
        <Button variant="secondary" className="mr-3" data-testid="reset-btn" onClick={handleReset}>
          Reset
        </Button>
        {selectedFile && <p className="mr-3">Uploaded: {progress}%</p>}
        {errorMessage && <p className="mr-3 text-red-500 font-bold">{errorMessage}</p>}
      </div>
    </div>
  );
}