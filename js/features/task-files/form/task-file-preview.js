/**
 * Initializes the file upload preview for the add-task form.
 * @param {Object} state
 */
function initTaskFileUpload(state) {
  if (!state?.fileInput || !state?.filePreview) return;
  state.selectedFiles = Array.isArray(state.selectedFiles)
    ? state.selectedFiles
    : [];
  state.fileInput.addEventListener("change", () => queueTaskFileChange(state));
  renderTaskFilePreview(state);
}

/**
 * Queues file input changes.
 * @param {Object} state
 */
function queueTaskFileChange(state) {
  state.fileUploadPending = handleTaskFileChange(state).finally(() => {
    state.fileUploadPending = null;
  });
}

/**
 * Handles file input changes.
 * @param {Object} state
 * @returns {Promise<void>}
 */
async function handleTaskFileChange(state) {
  const files = Array.from(state.fileInput?.files || []);
  if (files.length === 0) return;
  clearTaskFileError(state);
  setTaskFileUploadBusy(state, true);
  try {
    await appendTaskFiles(state, files);
  } catch (error) {
    console.error("Task file processing failed:", error);
    showTaskFileError(state, "The selected image could not be processed.");
  } finally {
    setTaskFileUploadBusy(state, false);
  }
  state.fileInput.value = "";
  renderTaskFilePreview(state);
}

/**
 * Appends new files to the state.
 * @param {Object} state
 * @param {File[]} files
 * @returns {Promise<void>}
 */
async function appendTaskFiles(state, files) {
  const typeError = validateTaskFileTypes(files);
  if (typeError) return showTaskFileError(state, typeError);
  const processedFiles = await processTaskFiles(files);
  const newFiles = filterNewTaskFiles(state.selectedFiles, processedFiles);
  if (newFiles.length === 0) return;
  if (exceedsTaskFileUploadLimit(state.selectedFiles, newFiles)) {
    clearTaskFileEntries(newFiles);
    return showTaskFileError(state, getTaskFileLimitErrorMessage());
  }
  newFiles.forEach((entry) => state.selectedFiles.push(entry));
}

/**
 * Filters out already selected files.
 * @param {Array} selectedFiles
 * @param {Array} nextFiles
 * @returns {Array}
 */
function filterNewTaskFiles(selectedFiles, nextFiles) {
  const acceptedFiles = [];
  (nextFiles || []).forEach((entry) => {
    if (hasTaskFile(selectedFiles, entry.sourceId)) {
      revokeTaskFilePreview(entry);
      return;
    }
    acceptedFiles.push(createTaskFileEntry(entry));
  });
  return acceptedFiles;
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
 * @param {Object} file
 * @returns {Object}
 */
function createTaskFileEntry(file) {
  return {
    id: file.sourceId,
    sourceId: file.sourceId,
    name: file.name,
    type: file.type,
    size: file.size,
    width: file.width,
    height: file.height,
    blob: file.blob,
    previewUrl: URL.createObjectURL(file.blob),
  };
}

/**
 * Creates state entries from persisted task files.
 * @param {Array} files
 * @returns {Array}
 */
function createPersistedTaskFileEntries(files) {
  return normalizePersistedTaskFiles(files).map((file, index) => {
    return buildPersistedTaskFileEntry(file, index);
  });
}

/**
 * Builds a state entry for a persisted file.
 * @param {Object} file
 * @param {number} index
 * @returns {Object}
 */
function buildPersistedTaskFileEntry(file, index) {
  const source = getTaskFileSource(file);
  return {
    id: buildPersistedTaskFileId(file, index),
    name: file.name || "image",
    type: file.type || "image/jpeg",
    size: file.size || 0,
    width: file.width || 0,
    height: file.height || 0,
    base64: source,
    previewUrl: source,
  };
}

/**
 * Builds an id for a persisted task file.
 * @param {Object} file
 * @param {number} index
 * @returns {string}
 */
function buildPersistedTaskFileId(file, index) {
  return `saved-${index}-${file?.name || "image"}`;
}

/**
 * Renders the task file list.
 * @param {Object} state
 */
function renderTaskFilePreview(state) {
  if (!state?.filePreview) return;
  const files = state.selectedFiles || [];
  clearTaskFilePreviewElement(state.filePreview);
  appendTaskFilePreviewItems(state, state.filePreview, files);
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
 * Appends all visible file rows.
 * @param {Object} state
 * @param {HTMLElement} preview
 * @param {Array} files
 */
function appendTaskFilePreviewItems(state, preview, files) {
  files.forEach((entry) => preview.appendChild(buildTaskFileRow(state, entry)));
}

/**
 * Builds one file row.
 * @param {Object} state
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildTaskFileRow(state, entry) {
  const row = document.createElement("div");
  row.className = "file-upload-item";
  row.appendChild(buildTaskFileRowPreviewButton(state, entry));
  row.appendChild(buildTaskFileDeleteButton(state, entry));
  return row;
}

/**
 * Builds the preview button for one file row.
 * @param {Object} state
 * @param {Object} entry
 * @returns {HTMLButtonElement}
 */
function buildTaskFileRowPreviewButton(state, entry) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "file-upload-item-preview";
  button.setAttribute("aria-label", `Open file ${entry.name || "image"}`);
  button.appendChild(buildTaskFileAvatar(entry));
  button.appendChild(buildTaskFileNameElement(entry));
  button.addEventListener("click", () => openTaskFilePreview(state, entry.id));
  return button;
}

/**
 * Builds an avatar for one file.
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildTaskFileAvatar(entry) {
  const avatar = document.createElement("span");
  const image = document.createElement("img");
  const source = getTaskFileSource(entry);
  avatar.className = "file-upload-avatar";
  avatar.title = entry.name || "Uploaded image";
  avatar.setAttribute("aria-label", entry.name || "Uploaded image");
  if (source) image.src = source;
  else image.hidden = true;
  image.alt = "";
  image.loading = "lazy";
  avatar.appendChild(image);
  return avatar;
}

/**
 * Builds the file name element.
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildTaskFileNameElement(entry) {
  const name = document.createElement("span");
  name.className = "file-upload-name";
  name.textContent = entry.name || "Image";
  name.title = entry.name || "Image";
  return name;
}

/**
 * Builds the delete button for a file row.
 * @param {Object} state
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildTaskFileDeleteButton(state, entry) {
  const button = document.createElement("button");
  const icon = document.createElement("img");
  button.type = "button";
  button.className = "file-upload-action";
  button.setAttribute("aria-label", `Remove file ${entry.name || "image"}`);
  icon.src = "/assets/img/icons/delete.svg";
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);
  button.addEventListener("click", () => removeTaskFile(state, entry.id));
  return button;
}

/**
 * Removes a selected task file.
 * @param {Object} state
 * @param {string} fileId
 */
function removeTaskFile(state, fileId) {
  const index = findTaskFileIndex(state.selectedFiles, fileId);
  if (index < 0) return;
  revokeTaskFilePreview(state.selectedFiles[index]);
  state.selectedFiles.splice(index, 1);
  renderTaskFilePreview(state);
}

/**
 * Opens the viewer for a selected preview file.
 * @param {Object} state
 * @param {string} fileId
 */
function openTaskFilePreview(state, fileId) {
  const index = findTaskFileIndex(state?.selectedFiles, fileId);
  if (index < 0) return;
  if (typeof openTaskFileViewer !== "function") return;
  openTaskFileViewer(state.selectedFiles, index);
}

/**
 * Finds a task file index by id.
 * @param {Array} files
 * @param {string} fileId
 * @returns {number}
 */
function findTaskFileIndex(files, fileId) {
  return (files || []).findIndex((entry) => entry?.id === fileId);
}

/**
 * Clears selected task files and revokes preview URLs.
 * @param {Object} state
 */
function clearTaskFileUpload(state) {
  clearTaskFileEntries(state?.selectedFiles || []);
  if (state) state.selectedFiles = [];
  if (state?.fileInput) state.fileInput.value = "";
  clearTaskFileError(state);
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
  if (!String(entry.previewUrl).startsWith("blob:")) return;
  URL.revokeObjectURL(entry.previewUrl);
}

/**
 * Waits for the current file processing task.
 * @param {Object} state
 * @returns {Promise<void>}
 */
async function waitForTaskFileUpload(state) {
  if (!state?.fileUploadPending) return;
  await state.fileUploadPending;
}

/**
 * Shows a task file field error.
 * @param {Object} state
 * @param {string} message
 */
function showTaskFileError(state, message) {
  state.fileError = message || "";
  showFieldError("task-files-error", state.fileError, state.fileTrigger);
}

/**
 * Clears the task file field error.
 * @param {Object} state
 */
function clearTaskFileError(state) {
  if (!state) return;
  state.fileError = "";
  clearFieldError("task-files-error", state.fileTrigger);
}

/**
 * Toggles the task file upload busy state.
 * @param {Object} state
 * @param {boolean} busy
 */
function setTaskFileUploadBusy(state, busy) {
  if (!state?.fileInput) return;
  state.fileInput.disabled = busy;
}
