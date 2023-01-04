import path from 'node:path'

export const getDirectoryName = (filePath: string) => {
  return path.basename(path.dirname(filePath))
}
