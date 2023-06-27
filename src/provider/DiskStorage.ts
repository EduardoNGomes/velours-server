import fs from 'fs'
import path from 'path'
import { TMP_FOLDER, UPLOADS_FOLDER } from '../config/multer'

export class DiskStorage {
  // async saveFile(file: any) {
  //   await fs.promises.rename(
  //     path.resolve(TMP_FOLDER, file),
  //     path.resolve(UPLOADS_FOLDER, file),
  //   )

  //   return file
  // }

  async deleteFile(file: any) {
    const filePath = path.resolve(TMP_FOLDER, file)
    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }
    await fs.promises.unlink(filePath)
  }
}
