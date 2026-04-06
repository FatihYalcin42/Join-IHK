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
  avatar.title = entry.name || "Uploaded image";
  avatar.setAttribute("aria-label", entry.name || "Uploaded image");
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
