import { createReadStream, ReadStream } from 'fs'

export const getFileToBuffer = (fieldname: string) => {
  const readStream = createReadStream(fieldname)
  const chunks: Buffer[] = []

  return new Promise<{ buffer: Buffer; stream: ReadStream }>((resolve, reject) => {
    readStream.on('data', chunk => {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk)
      }
    })
    readStream.on('error', err => reject(err))
    readStream.on('close', () => {
      resolve({
        buffer: Buffer.concat(chunks),
        stream: readStream,
      })
    })
  })
}
