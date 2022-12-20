import AWS from "aws-sdk";
import config from "../config/config";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "eu-central-1",
});

export function uploadFromBuffer(
  fileData: Buffer,
  bucketName: string,
  s3Key: string
) {
  return s3
    .upload({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileData,
    })
    .promise();
}

export function getPresignedDownloadUrl(
  bucketName: string,
  s3Key: string,
  expiration: number
) {
  return s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: s3Key,
    Expires: expiration,
  });
}

export function copyAndRenameFile(
  destBucketName: string,
  source: string,
  destinationKey: string
) {
  return s3
    .copyObject({
      Bucket: destBucketName,
      CopySource: source,
      Key: destinationKey,
    })
    .promise();
}

// export function updateFile() {}

export function deleteFile(bucketName: string, s3Key: string) {
  return s3.deleteObject({
    Bucket: bucketName,
    Key: s3Key,
  });
}

export function deleteMany(bucketName: string, keysToDelete: string[]) {
  return s3.deleteObjects({
    Bucket: bucketName,
    Delete: {
      Objects: keysToDelete.map((value) => {
        return { Key: value };
      }),
    },
  });
}
// export function listFiles(){}
