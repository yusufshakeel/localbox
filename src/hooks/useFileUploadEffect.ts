import {useState} from 'react';
import httpClient from '@/api-clients';

export type OptionType = {
  dir?: string
}

const useFileUploadEffect = (option: OptionType = {dir: 'uploads'}) => {
  const [file, setFile] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (formData: FormData) => {
    setError('');
    setFile('');
    try {
      const response = await httpClient.post<any>(
        `/api/upload`,
        formData,
        {dir: option.dir},
        {'Content-Type': 'multipart/form-data'}
      );
      if(response.statusCode === 200) {
        setFile(response.data.uploadedFileName);
      } else {
        setError('Failed to upload file');
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return {
    file,
    error,
    handleFileUpload
  };
};

export default useFileUploadEffect;