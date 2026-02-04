export type UploadableFile = Express.Multer.File;

export type StorageStrategy = 'local' | 'google-cloud';

export interface IStorageStrategy {
  saveFile(file: Buffer, folder: string, filename: string): Promise<string>;
  deleteFile(pathFile: string): Promise<void>;
  deleteFolder(pathFolder: string): Promise<void>;
}
