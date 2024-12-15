import Image from 'next/image';
import {Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import showToast from '@/utils/show-toast';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faMagnifyingGlass, faFile, faDownload, faPlay, faImage} from '@fortawesome/free-solid-svg-icons';
import {getFilename} from '@/utils/filename';
import httpClient from '@/api-clients';
import {FilesApiResponse} from '@/types/api-responses';

export type PropType = {
  dir: string,
  sort?: 'ASC' | 'DESC',
  actions: string[]
  actionHandlers?: any
  hasFixedHeight?: number
  viewIn?: 'list' | 'icon'
}

export default function ListDirectoryFilesComponent(props: PropType) {
  const [filesFilter, setFilesFilter] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [listOfFiles, setListOfFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await httpClient.get<FilesApiResponse>({
        url: '/api/files',
        params: { dir: props.dir, sort: props.sort }
      });
      if (response.statusCode === 200) {
        setFiles(response.data!.files);
        setListOfFiles(response.data!.files);
      }
    };
    fetchFiles().catch(e => showToast({content: e.message, type: 'error'}));
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
  }, [files, filesFilter]);

  const displayContent = () => {
    return listOfFiles.map((file: string, index) => {
      const fileName = getFilename(file);

      const buttonGroup = (file: string) => {
        return (
          <ButtonGroup className={props.viewIn === 'list' ? 'float-end': ''}>
            { props.actions.includes('playVideo')
              && <Button variant="outline-primary" size="sm" onClick={() => props.actionHandlers['playVideo'](file)}>
                <FontAwesomeIcon icon={faPlay}/> Play
              </Button> }
            { props.actions.includes('playAudio')
              && <Button variant="outline-primary" size="sm" onClick={() => props.actionHandlers['playAudio'](file)}>
                <FontAwesomeIcon icon={faPlay}/> Play
              </Button> }
            { props.actions.includes('viewImage')
              && <Button variant="outline-primary" size="sm" onClick={() => props.actionHandlers['viewImage'](file)}>
                <FontAwesomeIcon icon={faImage}/> View
              </Button> }
            { props.actions.includes('download')
              && <a className="btn btn-outline-primary btn-sm" href={`/${props.dir}/${encodeURIComponent(file)}`} download>
                <FontAwesomeIcon icon={faDownload}/>
              </a> }
          </ButtonGroup>
        );
      };

      if (props.viewIn === 'list') {
        return (
          <tr key={index}>
            <td>
              { props.actions.includes('viewImage')
                && <Image
                  className="me-2"
                  onClick={() => props.actionHandlers['viewImage'](file)}
                  width={200}
                  height={200}
                  style={{cursor: 'pointer'}}
                  src={`/${props.dir}/${encodeURIComponent(file)}`}
                  alt={file} />
              }
              <span className="mb-2">{fileName}</span>
              {buttonGroup(file)}
            </td>
          </tr>
        );
      }

      return (
        <Col key={index} xs={6} sm={6} md={3} lg={2}>
          <Card className="mb-4 text-center">
            <Card.Body>
              { props.actions.includes('viewImage')
                && <Image
                  onClick={() => props.actionHandlers['viewImage'](file)}
                  width={60}
                  height={60}
                  style={{cursor: 'pointer'}}
                  src={`/${props.dir}/${encodeURIComponent(file)}`}
                  alt={file} />
              }
              { !props.actions.includes('viewImage') && <FontAwesomeIcon size="3x" icon={faFile} className="mb-2"/> }
              <span className="mb-2 d-block">{fileName}</span>
              {buttonGroup(file)}
            </Card.Body>
          </Card>
        </Col>
      );
    });
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

              <Row style={props.hasFixedHeight ? {maxHeight: `${props.hasFixedHeight ?? 300}px`, overflowY: 'scroll'} : {}}>
                {
                  props.viewIn === 'list'
                    ? <Table responsive hover><tbody>{displayContent()}</tbody></Table>
                    : displayContent()
                }
              </Row>
            </>
          )
          : <h3 className="text-center">Empty</h3>
      }
    </>
  );
}