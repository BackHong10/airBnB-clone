import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
interface IFilesServiceUpload {
  files: FileUpload[];
}
@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload) {
    const waitedFile = await Promise.all(files);
    const bucket = 'codecamp-storage10';
    const storage = new Storage({
      projectId: 'vibrant-arcana-370212',
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFile.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => {
                resolve(`${bucket}/${el.filename}`);
              })
              .on('error', () => {
                reject('fail');
              });
          }),
      ),
    );
    return results;
  }
}
