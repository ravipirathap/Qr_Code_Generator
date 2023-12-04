const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const qrImage = require('qr-image');
const fs = require('fs');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config(); 
const PORT = process.env.PORT || 5000;
const url = process.env.db_url


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const QRCode = mongoose.model('QRCode', {
  data: String,
});


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  });

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());


app.post('/generate-qr', upload.single('file'), async (req, res) => {
    try {
      let qrCode;
  
      if (req.file) {
     
        const { filename } = req.file;
        qrCode = new QRCode({ data: filename });
      } else {
      
        const { text } = req.body;
        qrCode = new QRCode({ data: text });
      }
  
      await qrCode.save();
  
      const qrImageBuffer = qrImage.image(qrCode.data, { type: 'png' });
      qrImageBuffer.pipe(fs.createWriteStream(`uploads/${qrCode._id}.png`));
  
      res.json({ success: true, qrCodeId: qrCode._id });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

app.get('/get-qr/:id',(req, res) => {
  const { id } = req.params;

   res.sendFile(`${__dirname}/uploads/${id}.png`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
