import Image from 'next/image';
import {Button, ButtonGroup, Form, InputGroup, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import showToastHelper from '@/utils/show-toast';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

export type PropType = {
  dir: string,
  sort?: 'ASC' | 'DESC',
  actions: string[]
  actionHandlers?: any
}

export default function ListDirectoryFilesComponent(props: PropType) {
  const [filesFilter, setFilesFilter] = useState('');
  const [files, setFiles] = useState([]);
  const [listOfFiles, setListOfFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`/api/files?dir=${props.dir}&sort=${props.sort}`);
      const data = await response.json();
      setFiles(data.files);
      setListOfFiles(data.files);
    };
    fetchFiles().catch(e => showToastHelper({content: e.message, type: 'error'}));
  }, [props.dir, props.sort]);

  useEffect(() => {
    if (filesFilter.trim().length) {
      const filteredApp = files.filter((file: any) => {
        const regEx = new RegExp(filesFilter.trim(), 'ig');
        return file.match(regEx);
      });
      setListOfFiles(filteredApp);
    } else {
      setListOfFiles(files);
    }
  }, [files, filesFilter])

  const displayContent = () => {
    return listOfFiles.map((file, index) => {
      return (
        <tr key={index}>
          <td>
            { props.actions.includes('viewImage')
                && <Image
                  onClick={() => props.actionHandlers['viewImage'](file)}
                  width={200}
                  height={100}
                  style={{width: '100px', cursor: 'pointer'}}
                  src={`/${props.dir}/${encodeURIComponent(file)}`}
                  alt={file} />
            }
            &nbsp;
            {file}
            &nbsp;
            <ButtonGroup className="float-end">
              { props.actions.includes('download')
                && <a className="btn btn-outline-primary btn-sm" href={`/${props.dir}/${encodeURIComponent(file)}`} download>Download</a> }
              { props.actions.includes('playVideo')
                && <Button variant="outline-primary" size="sm" onClick={() => props.actionHandlers['playVideo'](file)}>Play</Button> }
              { props.actions.includes('playAudio')
                  && <Button variant="outline-primary" size="sm" onClick={() => props.actionHandlers['playAudio'](file)}>Play</Button> }
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
            <>
              <InputGroup className="mb-3">
                <InputGroup.Text><FontAwesomeIcon icon={faMagnifyingGlass}/></InputGroup.Text>
                <Form.Control
                  className="no-focus-border"
                  type="text"
                  placeholder='Search...'
                  value={filesFilter}
                  onChange={(e) => setFilesFilter(e.target.value)}
                />
                <Button onClick={() => setFilesFilter('')} variant="secondary">
                  <FontAwesomeIcon icon={faXmark}/>
                </Button>
              </InputGroup>
              <div style={{height: '300px', overflowY: 'scroll', border: '1px solid rgba(0, 0, 0, 0.175)'}}>
                <Table responsive bordered hover>
                  <tbody>{displayContent()}</tbody>
                </Table>
              </div>
            </>
          )
          : <h3 className="text-center">Empty</h3>
      }
    </>
  );
}