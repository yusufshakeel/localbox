import {Button, ButtonGroup, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import showToastHelper from '@/utils/show-toast';

export type PropType = {
  dir: string,
  actions: string[]
  actionHandlers?: any
}

export default function ListDirectoryFilesComponent(props: PropType) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`/api/files?dir=${props.dir}`);
      const data = await response.json();
      setFiles(data.files);
    };
    fetchFiles().catch(e => showToastHelper({content: e.message, type: 'error'}));
  }, []);

  const displayContent = () => {
    return files.map((file, index) => {
      return (
        <tr key={index}>
          <td>{file}</td>
          <td>
            <ButtonGroup>
              { props.actions.includes('download')
                && <a className="btn btn-outline-primary" href={`/${props.dir}/${encodeURIComponent(file)}`} download>Download</a> }
              { props.actions.includes('playVideo')
                && <Button variant="outline-primary" onClick={() => props.actionHandlers['playVideo'](file)}>Play</Button> }
            </ButtonGroup>
          </td>
        </tr>
      );
    })
  };

  return (
    <>
      {
        files.length
          ? (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{displayContent()}</tbody>
            </Table>
          )
          : <h3 className="text-center">Empty</h3>
      }
    </>
  );
}