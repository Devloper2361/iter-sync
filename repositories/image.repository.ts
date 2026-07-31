export class ImageRepository {
  async uploadImages(files: File[]): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return files.map(file => URL.createObjectURL(file));
  }
}

export const imageRepository = new ImageRepository();
