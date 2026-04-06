const MAX_TASK_FILE_PREVIEWS = 3;

/**
 * Initializes the file upload preview for the add-task form.
 * @param {Object} state
 */
function initTaskFileUpload(state) {
  if (!state?.fileInput || !state?.filePreview) return;
  state.selectedFiles = Array.isArray(state.selectedFiles)
    ? state.selectedFiles
    : [];
  state.fileInput.addEventListener("change", () => handleTaskFileChange(state));
  renderTaskFilePreview(state);
}

/**
 * Handles file input changes.
 * @param {Object} state
 */
function handleTaskFileChange(state) {
  const files = Array.from(state.fileInput?.files || []);
  if (files.length === 0) return;
  appendTaskFiles(state, files);
  state.fileInput.value = "";
  renderTaskFilePreview(state);
}

/**
 * Appends new files to the state.
 * @param {Object} state
 * @param {File[]} files
 */
function appendTaskFiles(state, files) {
  files.forEach((file) => appendTaskFile(state, file));
}

/**
 * Appends a single file if it is not already present.
 * @param {Object} state
 * @param {File} file
 */
function appendTaskFile(state, file) {
  const fileId = buildTaskFileId(file);
  if (hasTaskFile(state.selectedFiles, fileId)) return;
  state.selectedFiles.push(createTaskFileEntry(file, fileId));
}

/**
 * Checks if a file already exists in the list.
 * @param {Array} files
 * @param {string} fileId
 * @returns {boolean}
 */
function hasTaskFile(files, fileId) {
  return (files || []).some((entry) => entry.id === fileId);
}

/**
 * Creates a state entry for a selected file.
 * @param {File} file
 * @param {string} fileId
 * @returns {Object}
 */
function createTaskFileEntry(file, fileId) {
  return {
    id: fileId,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

/**
 * Builds a stable id for a file.
 * @param {File} file
 * @returns {string}
 */
function buildTaskFileId(file) {
  return [file.name, file.size, file.lastModified, file.type].join("__");
}

/**
 * Renders file preview avatars.
 * @param {Object} state
 */
function renderTaskFilePreview(state) {
  if (!state?.filePreview) return;
  const files = state.selectedFiles || [];
  clearTaskFilePreviewElement(state.filePreview);
  appendTaskFilePreviewItems(state.filePreview, files);
  appendTaskFilePreviewMore(state.filePreview, files.length);
  state.filePreview.hidden = files.length === 0;
}

/**
 * Clears the preview element.
 * @param {HTMLElement} preview
 */
function clearTaskFilePreviewElement(preview) {
  preview.innerHTML = "";
  preview.hidden = true;
}

/**
 * Appends visible preview items.
 * @param {HTMLElement} preview
 * @param {Array} files
 */
function appendTaskFilePreviewItems(preview, files) {
  files
    .slice(0, MAX_TASK_FILE_PREVIEWS)
    .forEach((entry) => preview.appendChild(buildTaskFileAvatar(entry)));
}

/**
 * Appends the more badge if needed.
 * @param {HTMLElement} preview
 * @param {number} total
 */
function appendTaskFilePreviewMore(preview, total) {
  if (total <= MAX_TASK_FILE_PREVIEWS) return;
  const extra = total - MAX_TASK_FILE_PREVIEWS;
  preview.appendChild(buildTaskFileMoreBadge(extra));
}

/**
 * Builds an avatar for one file preview.
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildTaskFileAvatar(entry) {
  const avatar = document.createElement("span");
  const image = document.createElement("img");
  avatar.className = "file-upload-avatar";
  avatar.title = entry.file?.name || "Uploaded image";
  avatar.setAttribute("aria-label", entry.file?.name || "Uploaded image");
  image.src = entry.previewUrl;
  image.alt = "";
  image.loading = "lazy";
  avatar.appendChild(image);
  return avatar;
}

/**
 * Builds the extra-files badge.
 * @param {number} count
 * @returns {HTMLElement}
 */
function buildTaskFileMoreBadge(count) {
  const badge = document.createElement("span");
  badge.className = "file-upload-avatar file-upload-avatar--more";
  badge.textContent = `+${count}`;
  badge.title = `${count} more files`;
  badge.setAttribute("aria-label", `${count} more files`);
  return badge;
}

/**
 * Clears selected task files and revokes preview URLs.
 * @param {Object} state
 */
function clearTaskFileUpload(state) {
  clearTaskFileEntries(state?.selectedFiles || []);
  if (state) state.selectedFiles = [];
  if (state?.fileInput) state.fileInput.value = "";
  renderTaskFilePreview(state);
}

/**
 * Revokes all preview URLs in the list.
 * @param {Array} files
 */
function clearTaskFileEntries(files) {
  (files || []).forEach((entry) => revokeTaskFilePreview(entry));
}

/**
 * Revokes a single preview URL.
 * @param {Object} entry
 */
function revokeTaskFilePreview(entry) {
  if (!entry?.previewUrl) return;
  URL.revokeObjectURL(entry.previewUrl);
}
