"server-only";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${uuidv4()}-${file.name}`;

    const uploadParams = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(uploadParams);

    console.log("Uploaded to s3.");

    return `${process.env.AWS_BUCKET_URL}/${key}`;
  } catch (error) {
    console.log("Error uploading to s3", error);
    return null;
  }
}
