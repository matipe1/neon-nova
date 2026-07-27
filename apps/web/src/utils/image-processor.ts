/**
 * Utility modular para procesamiento de imágenes en el cliente (Browser).
 * Convierte formatos (.png, .jpeg, .jpg, .heic, .webp) a WebP optimizado
 * antes de subir a Storage (Supabase / S3), ahorrando hasta un 80% de ancho de banda y espacio.
 */

export interface ProcessedImageResult {
  file: File;
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 a 1.0 (0.82 por defecto, ideal para balance calidad/peso)
}

export const processImageToWebP = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> => {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () =>
        reject(new Error('El formato de imagen no pudo ser decodificado por el navegador.'));

      img.onload = () => {
        // Redimensionamiento proporcional (Aspect Ratio Preservation)
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Crear Canvas en memoria para re-renderizar y comprimir a WebP
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto 2D del Canvas.'));
          return;
        }

        // Renderizar imagen con suavizado de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob WebP comprimido
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error en la conversión a formato WebP.'));
              return;
            }

            const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const compressedSizeKb = Math.round(compressedFile.size / 1024);
            const dataUrl = canvas.toDataURL('image/webp', quality);

            resolve({
              file: compressedFile,
              dataUrl,
              originalSizeKb,
              compressedSizeKb,
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
