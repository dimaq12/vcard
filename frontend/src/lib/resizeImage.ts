export const resizeImage = (
    file: File,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.7
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
  
          const aspectRatio = width / height;
  
          if (width > maxWidth || height > maxHeight) {
            if (aspectRatio > 1) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to get canvas context'));
  
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(resizedDataUrl);
        };
  
        img.onerror = reject;
      };
  
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  