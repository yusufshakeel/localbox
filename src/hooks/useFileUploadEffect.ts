import {useState} from 'react';
import httpClient from '@/api-clients';
import useUploadProgressEffect from '@/hooks/useUploadProgressEffect';

export type OptionType = {
  dir?: string
}

const useFileUploadEffect = (option: OptionType = {dir: 'uploads'}) => {
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const {progress, onUploadProgress, setProgress} = useUploadProgressEffect();

  const handleFileUpload = async (formData: FormData) => {
    setError('');
    setFile('');
    setProgress(0);
    try {
      const response = await httpClient.post<any>({
        url: `/api/upload`,
        body: formData,
        params: {dir: option.dir},
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress
      });
      if (response.statusCode === 200) {
        setFile(response.data.uploadedFileName);
      } else if (response.statusCode >= 400 && response.message) {
        setError(response.message);
      } else {
        setError('Failed to upload file');
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
    } finally {
      setProgress(0);
    }
  };

  return {
    file,
    error,
    progress,
    handleFileUpload
  };
};

export default useFileUploadEffect;