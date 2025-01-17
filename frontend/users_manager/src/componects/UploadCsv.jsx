import React, { useState } from 'react';
import axios from 'axios';

const UploadCsvModal = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/uploadCsv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message || 'File uploaded successfully.');
      setFile(null); // Clear file 
      setTimeout(() => {
        setMessage(''); // Clear the message
        const modal = document.getElementById('uploadCsvModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide(); // Hide the modal
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading file.');
      console.error(error);
    }
  };

  return (
    <>
      <button 
        type="button" 
        className="btn btn-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#uploadCsvModal">
        Upload CSV
      </button>

      <div 
        className="modal fade" 
        id="uploadCsvModal" 
        tabIndex="-1" 
        aria-labelledby="uploadCsvModalLabel" 
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="uploadCsvModalLabel">Upload CSV File</h5>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpload}>
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">Select a CSV file</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="formFile" 
                    accept=".csv" 
                    onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Upload</button>
              </form>
              {message && (
                <p 
                  style={{ 
                    marginTop: '20px', 
                    color: message.includes('Error') ? 'red' : 'green' 
                  }}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadCsvModal;
