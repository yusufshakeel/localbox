import showToast from '@/utils/show-toast';
import {useEffect, useRef, useState} from 'react';
import useFileUploadEffect from '@/hooks/useFileUploadEffect';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {getISOStringDate} from '@/utils/date';
import {AcceptFileType} from '@/types/file';

type PropType = {
  dir?: string,
  acceptFileType: string
  setLastUploadAt?: (_: string) => void
  isPersonalDriveFileUpload?: boolean
}

export default function FileUploadComponent({
  setLastUploadAt,
  dir,
  acceptFileType = AcceptFileType.any,
  isPersonalDriveFileUpload = false
}: PropType
) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    file,
    handleFileUpload,
    handlePersonalDriveFileUpload,
    error,
    progress
  } = useFileUploadEffect({ dir });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (isPersonalDriveFileUpload) {
        await handlePersonalDriveFileUpload(formData);
      } else {
        await handleFileUpload(formData);
      }
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
        {selectedFile && <span className="my-1">Uploaded: {progress}%</span>}
      </div>
    </div>
  );
}