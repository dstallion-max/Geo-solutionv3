import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import crypto from 'crypto'

const s3Client = new S3Client({
  endpoint: env.filebase.endpoint,
  region: env.filebase.region,
  credentials: {
    accessKeyId: env.filebase.accessKey,
    secretAccessKey: env.filebase.secretKey,
  },
  forcePathStyle: true,
})

export async function uploadFile(file, folder = 'photos') {
  if (!file) return null

  const ext = file.originalname.split('.').pop()
  const key = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`

  const command = new PutObjectCommand({
    Bucket: env.filebase.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  })

  await s3Client.send(command)

  // Construct the public URL
  return `${env.filebase.endpoint}/${env.filebase.bucket}/${key}`
}