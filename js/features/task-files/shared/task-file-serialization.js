/**
 * Serializes selected task files for persistence.
 * @param {Array} files
 * @returns {Promise<Array>}
 */
async function serializeTaskFiles(files) {
  const serializedFiles = [];
  for (const file of files || []) {
    serializedFiles.push(await serializeTaskFile(file));
  }
  return serializedFiles;
}

/**
 * Serializes a single task file entry.
 * @param {Object} file
 * @returns {Promise<Object>}
 */
async function serializeTaskFile(file) {
  if (hasValidTaskFileSource(file?.base64)) return normalizePersistedTaskFile(file);
  return {
    name: file.name || "image",
    type: file.type || "image/jpeg",
    size: file.size || 0,
    width: file.width || 0,
    height: file.height || 0,
    base64: await convertTaskBlobToBase64(file.blob),
  };
}

/**
 * Converts a blob to base64 data URL format.
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function convertTaskBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (!(blob instanceof Blob)) {
      return reject(new Error("Task file blob is missing."));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Task file conversion failed."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Merges persisted files with newly selected ones.
 * @param {Array} existingFiles
 * @param {Array} newFiles
 * @returns {Array}
 */
function mergePersistedTaskFiles(existingFiles, newFiles) {
  return [...normalizePersistedTaskFiles(existingFiles), ...(newFiles || [])];
}

/**
 * Normalizes persisted task files to an array.
 * @param {any} files
 * @returns {Array}
 */
function normalizePersistedTaskFiles(files) {
  if (!Array.isArray(files)) return [];
  return files.filter((file) => file && hasValidTaskFileSource(file.base64));
}

/**
 * Normalizes one persisted task file.
 * @param {Object} file
 * @returns {Object}
 */
function normalizePersistedTaskFile(file) {
  return {
    name: file.name || "image",
    type: file.type || "image/jpeg",
    size: file.size || 0,
    width: file.width || 0,
    height: file.height || 0,
    base64: normalizeTaskFileSource(file.base64),
  };
}

/**
 * Returns a normalized task file source string.
 * @param {any} value
 * @returns {string}
 */
function normalizeTaskFileSource(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  if (source === "undefined" || source === "null") return "";
  return source;
}

/**
 * Returns whether a source string is valid for file previews/downloads.
 * @param {any} value
 * @returns {boolean}
 */
function hasValidTaskFileSource(value) {
  return normalizeTaskFileSource(value).length > 0;
}

/**
 * Returns the preferred display source for a task file.
 * @param {Object} file
 * @returns {string}
 */
function getTaskFileSource(file) {
  return normalizeTaskFileSource(file?.base64 || file?.previewUrl);
}

/**
 * Checks whether the persisted task files exceed the database limit.
 * @param {Array} files
 * @returns {boolean}
 */
function exceedsPersistedTaskFileLimit(files) {
  return getPersistedTaskFilesBytes(files) > TASK_FILE_LIMIT_BYTES;
}

/**
 * Returns the persisted total size in bytes.
 * @param {Array} files
 * @returns {number}
 */
function getPersistedTaskFilesBytes(files) {
  return (files || []).reduce((sum, file) => sum + getPersistedTaskFileBytes(file), 0);
}

/**
 * Returns the persisted size of a single file.
 * @param {Object} file
 * @returns {number}
 */
function getPersistedTaskFileBytes(file) {
  const base64 = String(file?.base64 || "");
  if (!base64) return Number(file?.size) || 0;
  return calculateTaskBase64Bytes(base64);
}

/**
 * Calculates byte size from a base64 data URL.
 * @param {string} value
 * @returns {number}
 */
function calculateTaskBase64Bytes(value) {
  const base64 = String(value).split(",").pop() || "";
  const padding = getTaskBase64Padding(base64);
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Returns the number of base64 padding characters.
 * @param {string} value
 * @returns {number}
 */
function getTaskBase64Padding(value) {
  if (value.endsWith("==")) return 2;
  if (value.endsWith("=")) return 1;
  return 0;
}
