/**
 * Returns whether the file type is allowed.
 * @param {File} file
 * @returns {boolean}
 */
function isTaskFileTypeAllowed(file) {
  return TASK_FILE_ALLOWED_TYPES.includes(file?.type || "");
}

/**
 * Validates file types for one selection.
 * @param {File[]} files
 * @returns {string}
 */
function validateTaskFileTypes(files) {
  if ((files || []).every((file) => isTaskFileTypeAllowed(file))) return "";
  return `Only ${TASK_FILE_ALLOWED_TYPES_LABEL} images are allowed.`;
}

/**
 * Returns the combined byte size of processed files.
 * @param {Array} entries
 * @returns {number}
 */
function getTaskFilesTotalBytes(entries) {
  return (entries || []).reduce((sum, entry) => sum + getTaskFileBytes(entry), 0);
}

/**
 * Returns the byte size for one processed file.
 * @param {Object} entry
 * @returns {number}
 */
function getTaskFileBytes(entry) {
  if (!entry) return 0;
  if (typeof entry.size === "number") return entry.size;
  return entry.blob?.size || 0;
}

/**
 * Checks whether the task file upload limit would be exceeded.
 * @param {Array} existingFiles
 * @param {Array} nextFiles
 * @returns {boolean}
 */
function exceedsTaskFileUploadLimit(existingFiles, nextFiles) {
  const totalBytes =
    getTaskFilesTotalBytes(existingFiles) + getTaskFilesTotalBytes(nextFiles);
  return totalBytes > TASK_FILE_LIMIT_BYTES;
}

/**
 * Returns the upload limit error message.
 * @returns {string}
 */
function getTaskFileLimitErrorMessage() {
  return "The total image upload limit is 1 MB per task.";
}

