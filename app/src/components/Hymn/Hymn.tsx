import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useEditMode } from '../../context/EditModeContext';
import { FileInterface, HymnInterface } from '../../interfaces/interfaces';
import EditHymnBar from '../EditHymnBar/EditHymnBar';
import HymnFilesList from '../HymnFilesList';
import './Hymn.css';

interface Props {
  hymnData: HymnInterface;
  refreshHymnData: (endpoint?: string) => void;
}

const Hymn: React.FC<Props> = ({ hymnData, refreshHymnData }) => {
  // Context
  const { editMode } = useEditMode();

  const [localHymnData, setLocalHymnData] = useState(hymnData);
  const [files, setFiles] = useState<FileInterface[]>([
    { id: '', name: '', fileTypeId: 0, bookId: 0, hymnNum: 0, comment: '' },
  ]);

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/hymns/${hymnData.id}/files`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((e) => console.error(`Get files failed:\n${e}`));

    setLocalHymnData(hymnData);
    //eslint-disable-next-line
  }, [hymnData]);

  const editLocalHymnData = (key: keyof HymnInterface, data: any) => {
    const updatedHymnData = { ...localHymnData };
    updatedHymnData[key] = data;
    setLocalHymnData(updatedHymnData);
  };

  const handleHymnNameChange = (e: React.ChangeEvent) => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editLocalHymnData('name', updatedHymnName);
  };

  const handleLyricsChange = (e: React.ChangeEvent) => {
    const updatedLyrics = (e.target as HTMLTextAreaElement).value;
    editLocalHymnData('lyrics', updatedLyrics);
  };

  const handleSaveChanges = async () => {
    // Update the hymn data
    await axios
      .put(`/hymns/${localHymnData.id}`, {
        name: localHymnData.name,
        altName: localHymnData.altName,
        lyrics: localHymnData.lyrics,
      })
      .then((res) => {
        alert(`Hymn saved successfully`);
        refreshHymnData(res.headers.location);
      })
      .catch((e) => {
        alert(`Error saving hymns:\n${e.response.status}: ${e.response.data}`);
      });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete`)) {
      await axios
        .delete(`/hymns/${localHymnData.id}`)
        .then((res) => {
          alert(`Hymn deleted successfully`);
          refreshHymnData('');
        })
        .catch((e) => {
          alert(
            `Error deleting hymn:\n${e.response.status}: ${e.response.data}`
          );
        });
    }
  };

  const handleCancelChanges = () => {
    setLocalHymnData(hymnData);
  };

  return (
    <div>
      <EditHymnBar
        handleSaveChanges={handleSaveChanges}
        handleDelete={handleDelete}
        handleCancelChanges={handleCancelChanges}
      />
      <TextareaAutosize
        className="hymnName"
        disabled={!editMode}
        value={localHymnData.name}
        onChange={handleHymnNameChange}
      ></TextareaAutosize>
      <br />
      <h4>Music Files</h4>
      <HymnFilesList
        hymnId={hymnData.id}
        files={files}
        setFiles={setFiles}
        refreshHymnData={refreshHymnData}
      />
      <br />
      <div className="lyrics">
        <h4>Lyrics</h4>
        <TextareaAutosize
          className="lyricsText"
          disabled={!editMode}
          value={localHymnData.lyrics ? localHymnData.lyrics : ''}
          onChange={handleLyricsChange}
        ></TextareaAutosize>
      </div>
    </div>
  );
};

export default Hymn;
