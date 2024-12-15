import {useState} from 'react';

export type OptionType = {
  dir?: string
}

const useFileUploadEffect = (option: OptionType = {dir: 'uploads'}) => {
  const [file, setFile] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError('');
    setFile('');
    try {
      const response: any = await fetch(`/api/upload?dir=${option.dir}`, {
        method: 'POST',
        body: formData
      });
      const json = await response.json();
      if (response.ok) {
        setFile(json.uploadedFileName);
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