const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const dataFolderPath = './data';
const allowedExtensions = ['.svg', '.png'];
const minSize = 100;
const maxSize = 500;
const maxFileSize = 20 * 1024; // 20KB in bytes

fs.readdir(dataFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading files:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    const extension = path.extname(file);

    if (!file.includes('logo')) {
      console.error(`Invalid file name: ${file}`);
      console.error('File name must be "logo"');
      return;
    }

    // check if image is svg or png
    if (!allowedExtensions.includes(extension)) {
      console.error(`Invalid file type: ${file}`);
      console.error(`Allowed extensions: ${allowedExtensions.join(', ')}`);
      return;
    }

    const filePath = path.join(dataFolderPath, file);

    // check if image is lesser than file max size
    const fileSize = fs.statSync(filePath).size;
    if (fileSize > maxFileSize) {
      console.error(`File size exceeds the limit: ${file}`);
      console.error(`File size: ${fileSize} bytes`);
      return;
    }

    Jimp.read(filePath, (err, image) => {
      if (err) {
        console.error(`Error reading image: ${file}`, err);
        return;
      }

      const width = image.bitmap.width;
      const height = image.bitmap.height;

      // check if token image is square
      if (width !== height) {
        console.error(`Image is not square: ${file}`);
        console.error(`Width: ${width}, Height: ${height}`);
        return;
      }
      // check if image dimensions fall within length parameters
      if (width < minSize || width > maxSize) {
        console.error(`Image size is not within the allowed range: ${file}`);
        console.error(`Width: ${width}, Height: ${height}`);
        return;
      }

      console.log(`Image passed validation: ${file}`);
    });
  });
});