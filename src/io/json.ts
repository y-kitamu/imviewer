export const loadJson = (inputFile: File) =>
  new Promise<{ [key: string]: any }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result;
      if (text == null) {
        return;
      }
      try {
        resolve(JSON.parse(text as string));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(inputFile);
  });
