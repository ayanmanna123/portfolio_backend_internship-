const ImageKit = require('imagekit');
const env = require('./env');

let imagekit = null;

if (env.IMAGEKIT_PUBLIC_KEY && env.IMAGEKIT_PRIVATE_KEY && env.IMAGEKIT_URL_ENDPOINT) {
  try {
    imagekit = new ImageKit({
      publicKey: env.IMAGEKIT_PUBLIC_KEY.trim(),
      privateKey: env.IMAGEKIT_PRIVATE_KEY.trim(),
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT.trim()
    });
    console.log('🖼️ ImageKit service initialized successfully with endpoint:', env.IMAGEKIT_URL_ENDPOINT);
  } catch (err) {
    console.warn('⚠️ Error initializing ImageKit:', err.message);
    imagekit = null;
  }
} else {
  console.log('ℹ️ ImageKit credentials not fully provided. Uploads will use local disk storage /uploads.');
}

const isImageKitConfigured = () => !!imagekit;

const uploadToImageKit = async (fileBuffer, fileName, folder = '/portfolio') => {
  if (!imagekit) {
    throw new Error('ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env');
  }

  // Convert buffer to base64 if needed
  const fileData = Buffer.isBuffer(fileBuffer) ? fileBuffer.toString('base64') : fileBuffer;

  const result = await imagekit.upload({
    file: fileData,
    fileName: fileName,
    folder: folder,
    useUniqueFileName: true
  });

  return {
    fileId: result.fileId,
    name: result.name,
    url: result.url,
    thumbnailUrl: result.thumbnailUrl || result.url,
    size: result.size,
    fileType: result.fileType
  };
};

const deleteFromImageKit = async (fileId) => {
  if (!imagekit || !fileId) return false;
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (err) {
    console.warn('⚠️ ImageKit deleteFile warning:', err.message);
    return false;
  }
};

const getAuthenticationParameters = () => {
  if (!imagekit) {
    throw new Error('ImageKit is not configured');
  }
  return imagekit.getAuthenticationParameters();
};

module.exports = {
  imagekit,
  isImageKitConfigured,
  uploadToImageKit,
  deleteFromImageKit,
  getAuthenticationParameters
};

