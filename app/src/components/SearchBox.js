import '../styles/Files.css';
import { useState } from 'react';
import axios from 'axios';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SearchBox = ({ data, setData, apiPath, placeholder, addLabel }) => {
  const handleInputChange = (input) => {
    setData({ name: input });
    handleSearch(input);
  };

  const handleSelection = (selected) => {
    if (selected.length > 0) {
      setData(selected[0]);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const handleSearch = (query) => {
    setIsLoading(true);
    makeAndHandleRequest(query)
      .then((options) => {
        setIsLoading(false);
        setOptions(options);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const makeAndHandleRequest = (query) => {
    return axios
      .get(apiPath, { params: { q: query } })
      .then((res) => {
        setOptions(res.data);
      })
      .catch('makeAndHandleRequest failed');
  };

  if (addLabel) {
    return (
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextHymnName">
        <Form.Label column sm="3">
          {placeholder}:
        </Form.Label>
        <Col sm="9">
          <AsyncTypeahead
            id="search"
            isLoading={isLoading}
            labelKey="name"
            onSearch={handleSearch}
            onChange={handleSelection}
            onInputChange={handleInputChange}
            selected={[data.name]}
            options={options}
            placeholder={placeholder}
            renderMenuItemChildren={(option) => <p>{option.name}</p>}
          />
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Form.Group controlId="formFile" className="mb-3">
        <AsyncTypeahead
          id="search"
          isLoading={isLoading}
          labelKey="name"
          onSearch={handleSearch}
          onChange={handleSelection}
          onInputChange={handleInputChange}
          selected={[data.name]}
          options={options}
          placeholder={placeholder}
          renderMenuItemChildren={(option) => <p>{option.name}</p>}
        />
      </Form.Group>
    );
  }
};

export default SearchBox;
