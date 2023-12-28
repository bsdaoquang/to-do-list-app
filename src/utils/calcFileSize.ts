export const calcFileSize = (size: number) => {
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
  let i = 0;
  while (size > 900) {
    size /= 1024; //divide file size
    i++;
  }
  //get exact size
  var exactSize = Math.round(size * 100) / 100 + ' ' + fSExt[i];
  return exactSize;
};
