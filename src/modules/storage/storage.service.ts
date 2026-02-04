import { Injectable, NotImplementedException, Logger } from '@nestjs/common';

import {
  StorageStrategy,
  IStorageStrategy,
  UploadableFile,
} from './interfaces/storage.interface';

import { LocalStrategy } from './strategies/local.storage.strategy';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly localStrategy: LocalStrategy) {}

  async saveFile(
    file: UploadableFile,
    path: string,
    strategy: StorageStrategy,
  ): Promise<string> {
    const buffer = file.buffer;
    const filename = file.filename;

    this.logAction('Save file', path, strategy);
    return this.getStrategy(strategy).saveFile(buffer, path, filename);
  }

  async deleteFile(path: string, strategy: StorageStrategy): Promise<void> {
    this.logAction('Delete file', path, strategy);
    return this.getStrategy(strategy).deleteFile(path);
  }

  async deleteFolder(pathFolder: string, strategy: StorageStrategy) {
    this.logAction('Delete folder', pathFolder, strategy);
    const strategyInstance = this.getStrategy(strategy);

    return strategyInstance.deleteFolder(pathFolder);
  }

  getFileUrl(pathFile: string): string {
    this.logAction('Get file URL', pathFile, 'local');
    return this.localStrategy.getFileUrl(pathFile);
  }

  private getStrategy(strategy: StorageStrategy): IStorageStrategy {
    switch (strategy) {
      case 'local':
        return this.localStrategy;
      default:
        throw new NotImplementedException();
    }
  }

  private logAction(action: string, path: string, strategy: string) {
    this.logger.log(
      '\n==============================\n' +
        '   📦 StorageService Action    \n' +
        '------------------------------\n' +
        `   Action    : ${action}\n` +
        `   Path      : ${path}\n` +
        `   Strategy  : ${strategy}\n` +
        '==============================\n',
    );
  }
}
