import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [qrCodeId, setQRCodeId] = useState('');

  const generateQRCode = async () => {
    try {
      const formData = new FormData();
      
      // If a file is selected, append it to the form data
      if (file) {
        formData.append('file', file);
      } else {
        // Otherwise, append the text
        formData.append('text', text);
      }

      const response = await axios.post('http://localhost:5000/generate-qr', formData);
      setQRCodeId(response.data.qrCodeId);
    } catch (error) {
      console.error('Error generating QR code:', error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCodeId && (
        <div>
          <p>Your QR Code ID: {qrCodeId}</p>
          <img src={`http://localhost:5000/get-qr/${qrCodeId}`} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default App;
