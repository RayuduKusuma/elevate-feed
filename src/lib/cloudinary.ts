export const CLOUDINARY_CONFIG = {
  cloudName: 'dqlhmoejo',
  uploadPreset: 'instagram',
  uploadUrl: 'https://api.cloudinary.com/v1_1/dqlhmoejo/auto/upload',
};

interface UploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
    format: data.format,
    resource_type: data.resource_type,
  };
}

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
} = {}): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  const transforms = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}
