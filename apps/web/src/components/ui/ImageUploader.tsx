import { useState, useRef } from 'react';
import { processImageToWebP } from '../../utils/image-processor';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({
  images,
  onChange,
  maxImages = 3,
}: ImageUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= maxImages) {
      alert(`Solo se permiten un máximo de ${maxImages} imágenes por producto.`);
      return;
    }

    const file = files[0];
    setIsProcessing(true);
    setCompressionInfo(null);

    try {
      // 🚀 Conversión automática en el cliente a WebP Comprimido
      const result = await processImageToWebP(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
      });

      const updated = [...images, result.dataUrl];
      onChange(updated);

      setCompressionInfo(
        `Optimizado: ${result.originalSizeKb} KB ➔ ${result.compressedSizeKb} KB (WebP)`
      );
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert(
        'No se pudo procesar la imagen. Verifica que el archivo sea JPG, PNG, WEBP o HEIC válido.'
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div
      style={{
        backgroundColor: '#09090b',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
            🖼️ Imágenes del Producto (Máximo {maxImages})
          </span>
          <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
            Formatos: JPG, PNG, WEBP, HEIC (iPhone). Se optimizan automáticamente a WebP.
          </span>
        </div>

        {images.length < maxImages && (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: '#a855f7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isProcessing ? 'wait' : 'pointer',
              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing ? 'Procesando...' : '+ Subir Imagen'}
          </button>
        )}
      </div>

      {/* Input oculto para abrir selector nativo de archivos (PC o Celular) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/heic, .heic, .heif"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Info Badge de Compresión */}
      {compressionInfo && (
        <div
          style={{
            fontSize: '11px',
            color: '#4ade80',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          ⚡ {compressionInfo}
        </div>
      )}

      {/* Grilla de Previsualización de Imágenes Cuadradas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {images.map((url, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #3f3f46',
              aspectRatio: '1 / 1',
              width: '100%',
              backgroundColor: '#18181b',
            }}
          >
            <img
              src={url}
              alt={`Producto ${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Badge de Nro de Imagen */}
            <span
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              #{idx + 1} {idx === 0 ? '(Principal)' : ''}
            </span>

            {/* Botón Eliminar */}
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.85)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              gridColumn: 'span 3',
              padding: '24px',
              textAlign: 'center',
              border: '2px dashed #3f3f46',
              borderRadius: '8px',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Haz click aquí para subir una o varias fotos de este producto.
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
