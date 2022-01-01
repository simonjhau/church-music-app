import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Hymn from '../components/Hymn/Hymn';
import NewHymnButtonModal from '../components/NewHymnButtonModal/NewHymnButtonModal';
import SearchBox from '../components/SearchBox/SearchBox';
import EditModeProvider, { useEditMode } from '../context/EditModeContext';
import { HymnInterface } from '../interfaces/interfaces';

const HymnsPage = () => {
  // Set edit mode to false on first render
  const { setEditMode } = useEditMode();
  useEffect(() => {
    setEditMode(false);
    //eslint-disable-next-line
  }, []);

  const defaultHymnData = {
    id: '',
    name: '',
    altName: '',
    lyrics: '',
  };

  const [hymnData, setHymnData] = useState<HymnInterface>(defaultHymnData);

  const refreshHymnData = (endpoint: string = '') => {
    if (endpoint) {
      axios
        .get(endpoint)
        .then((res) => {
          setHymnData(res.data[0]);
        })
        .catch((e) => console.error(`Get hymn failed:\n${e}`));
    } else {
      setHymnData(defaultHymnData);
    }
  };

  return (
    <div className="Upload">
      <EditModeProvider>
        <Form.Label>Search for hymns</Form.Label>
        <Row>
          <Col className="d-grid" sm={9}>
            <SearchBox
              data={hymnData}
              setData={setHymnData}
              apiPath="/hymns"
              placeholder="Hymn Name"
              addLabel={false}
            />
          </Col>
          <Col className="d-grid">
            <NewHymnButtonModal refreshHymnData={refreshHymnData} />
          </Col>
        </Row>

        {hymnData.id && (
          <Hymn hymnData={hymnData} refreshHymnData={refreshHymnData}></Hymn>
        )}
      </EditModeProvider>
    </div>
  );
};

export default HymnsPage;
