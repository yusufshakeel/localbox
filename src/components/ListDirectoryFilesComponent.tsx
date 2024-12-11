import Image from 'next/image';
import {Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import showToastHelper from '@/utils/show-toast';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faMagnifyingGlass, faFile, faDownload, faPlay} from '@fortawesome/free-solid-svg-icons';

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
    return listOfFiles.map((file: string, index) => {
      let fileName = file;

      // remove timestamp part when file name is like 1733659240385-hello-world.txt
      if(/^\d{10,}-.*$/gi.test(fileName)) {
        fileName = fileName.replace(/^\d{10,}-/gi,'')
      }
      // remove timestamp part when file name is like 2024-12-08T12:01:42.922Z-hello-world.txt
      else if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-.*$/gi.test(fileName)) {
        fileName = fileName.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z-/gi,'')
      }

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
                  onClick={() => props.actionHandlers['viewImage'](file)}
                  width={60}
                  height={60}
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