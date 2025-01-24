/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { env } from "@/env.js";
import AWS from "aws-sdk";
import imageCompression from "browser-image-compression";

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Return original file if compression fails
  }
};

export const uploadFile = async (file: File, name: string, no: number) => {
  // Compress the file before upload
  const compressedFile = await compressImage(file);

  // S3 Bucket Name
  const S3_BUCKET = env.NEXT_PUBLIC_AWS_BUCKET_NAME;

  // S3 Region
  const REGION = env.NEXT_PUBLIC_AWS_REGION;

  // S3 Credentials
  AWS.config.update({
    accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
    signatureVersion: "v4",
  });

  // Files Parameters
  const params = {
    Bucket: S3_BUCKET,
    Key: `squidgame-${name}.${file?.name.split(".")[1]}`,
    Body: compressedFile,
  };

  // Uploading file to s3

  const upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      // File uploading progress
      return console.log(evt.loaded);
    })
    .promise();
  let success = false;
  await upload
    .then(async () => {
      console.log("File uploaded successfully to S3.");
      const res = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({
          filename: params.Key,
          number: no,
        }),
      });
      if (res.ok) {
        success = true;
      } else {
        success = false;
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Server Error");
      success = false;
    });
  return { filename: params.Key, success };
};
