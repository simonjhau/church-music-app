import {} from 'dotenv/config';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

export const getFile = (name) => {
  const downloadParams = {
    Key: name,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
};

export const getListOfFiles = () => {
  const params = {
    Bucket: bucketName,
  };
  return s3.listObjectsV2(params).createReadStream();
};
