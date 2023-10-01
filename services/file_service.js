class FileService {
  async splitUrlToFileName(fileUrl) {
    if (!fileUrl) return;
    const fileName = fileUrl.split("/")[fileUrl.split("/").length - 1];
    const keyToDelete = `uploads/${fileName}`;
    return keyToDelete;
  }
}

module.exports = new FileService();
