export const loadImage = (inputFile: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);
    reader.onloadend = () => {
      if (!(typeof reader.result === "string")) {
        reject(new Error("Failed to get image URL"));
        return;
      }
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        resolve(image);
      };
    };
  });
