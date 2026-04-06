/**
 * Processes selected task files for storage.
 * @param {File[]} files
 * @returns {Promise<Array>}
 */
async function processTaskFiles(files) {
  const processedFiles = [];
  for (const file of files || []) {
    processedFiles.push(await processTaskFile(file));
  }
  return processedFiles;
}

/**
 * Processes a single task file.
 * @param {File} file
 * @returns {Promise<Object>}
 */
async function processTaskFile(file) {
  const image = await loadTaskFileImage(file);
  const size = getTaskFileTargetSize(image);
  const type = getTaskFileOutputType(file.type);
  const blob = await renderTaskFileBlob(image, size, type);
  return buildProcessedTaskFile(file, blob, size, type);
}

/**
 * Loads an image from a file.
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
function loadTaskFileImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image processing failed."));
    };
    image.src = objectUrl;
  });
}

/**
 * Returns the scaled image size.
 * @param {HTMLImageElement} image
 * @returns {{ width: number, height: number }}
 */
function getTaskFileTargetSize(image) {
  const width = image.naturalWidth || image.width || 1;
  const height = image.naturalHeight || image.height || 1;
  const scale = Math.min(1, TASK_FILE_MAX_DIMENSION / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Returns the output mime type for a task image.
 * @param {string} inputType
 * @returns {string}
 */
function getTaskFileOutputType(inputType) {
  if (inputType === "image/png" || inputType === "image/webp") {
    return "image/webp";
  }
  return "image/jpeg";
}

/**
 * Renders a resized image blob.
 * @param {HTMLImageElement} image
 * @param {{ width: number, height: number }} size
 * @param {string} type
 * @returns {Promise<Blob>}
 */
function renderTaskFileBlob(image, size, type) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return Promise.reject(new Error("Canvas not supported."));
  canvas.width = size.width;
  canvas.height = size.height;
  context.drawImage(image, 0, 0, size.width, size.height);
  return convertCanvasToBlob(canvas, type, getTaskFileOutputQuality(type));
}

/**
 * Returns the output quality for a task image type.
 * @param {string} type
 * @returns {number}
 */
function getTaskFileOutputQuality(type) {
  if (type === "image/webp") return TASK_FILE_WEBP_QUALITY;
  return TASK_FILE_JPEG_QUALITY;
}

/**
 * Converts a canvas to a blob.
 * @param {HTMLCanvasElement} canvas
 * @param {string} type
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
function convertCanvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) return resolve(blob);
      reject(new Error("Image compression failed."));
    }, type, quality);
  });
}

/**
 * Builds the processed task file object.
 * @param {File} file
 * @param {Blob} blob
 * @param {{ width: number, height: number }} size
 * @param {string} type
 * @returns {Object}
 */
function buildProcessedTaskFile(file, blob, size, type) {
  return {
    sourceId: buildTaskSourceId(file),
    name: buildProcessedTaskFileName(file.name, type),
    type,
    size: blob.size,
    width: size.width,
    height: size.height,
    blob,
  };
}

/**
 * Builds a stable id for a source file.
 * @param {File} file
 * @returns {string}
 */
function buildTaskSourceId(file) {
  return [file.name, file.size, file.lastModified, file.type].join("__");
}

/**
 * Returns the normalized output filename.
 * @param {string} name
 * @param {string} type
 * @returns {string}
 */
function buildProcessedTaskFileName(name, type) {
  const baseName = String(name || "image").replace(/\.[^.]+$/, "");
  return `${baseName}.${getTaskFileExtension(type)}`;
}

/**
 * Returns the file extension for the mime type.
 * @param {string} type
 * @returns {string}
 */
function getTaskFileExtension(type) {
  if (type === "image/webp") return "webp";
  return "jpg";
}
