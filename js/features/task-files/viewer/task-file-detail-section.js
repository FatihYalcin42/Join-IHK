/**
 * Creates the task files section for the detail overlay.
 * @param {Object} task
 * @returns {DocumentFragment|HTMLElement}
 */
function createTaskFilesSection(task) {
  const files = getTaskDetailFiles(task);
  if (files.length === 0) return document.createDocumentFragment();
  return buildTaskFilesSection(files);
}

/**
 * Returns normalized task files for the detail view.
 * @param {Object} task
 * @returns {Array}
 */
function getTaskDetailFiles(task) {
  if (!Array.isArray(task?.files)) return [];
  return task.files.filter((file) => file?.base64);
}

/**
 * Builds the detail files section.
 * @param {Array} files
 * @returns {HTMLElement}
 */
function buildTaskFilesSection(files) {
  const section = document.createElement("div");
  section.className = "task-detail-section";
  section.appendChild(createSectionLabel("Files:"));
  section.appendChild(buildTaskFilesList(files));
  return section;
}

/**
 * Builds the files list element.
 * @param {Array} files
 * @returns {HTMLElement}
 */
function buildTaskFilesList(files) {
  const list = document.createElement("div");
  list.className = "task-detail-files";
  files.forEach((file, index) => list.appendChild(buildTaskFileItem(file, index)));
  return list;
}

/**
 * Builds one task file item.
 * @param {Object} file
 * @param {number} index
 * @returns {HTMLElement}
 */
function buildTaskFileItem(file, index) {
  const item = document.createElement("div");
  item.className = "task-detail-file";
  item.appendChild(buildTaskFileThumb(file, index));
  item.appendChild(buildTaskFileMeta(file));
  return item;
}

/**
 * Builds the file thumbnail.
 * @param {Object} file
 * @param {number} index
 * @returns {HTMLElement}
 */
function buildTaskFileThumb(file, index) {
  const image = document.createElement("img");
  image.className = "task-detail-file-thumb";
  image.src = file.base64;
  image.alt = file.name || `Task file ${index + 1}`;
  image.loading = "lazy";
  return image;
}

/**
 * Builds the file meta block.
 * @param {Object} file
 * @returns {HTMLElement}
 */
function buildTaskFileMeta(file) {
  const meta = document.createElement("div");
  meta.className = "task-detail-file-meta";
  meta.appendChild(buildTaskFileName(file));
  meta.appendChild(buildTaskFileInfo(file));
  return meta;
}

/**
 * Builds the file name element.
 * @param {Object} file
 * @returns {HTMLElement}
 */
function buildTaskFileName(file) {
  const name = document.createElement("span");
  name.className = "task-detail-file-name";
  name.textContent = file.name || "Image";
  name.title = file.name || "Image";
  return name;
}

/**
 * Builds the file info row.
 * @param {Object} file
 * @returns {HTMLElement}
 */
function buildTaskFileInfo(file) {
  const info = document.createElement("span");
  info.className = "task-detail-file-info";
  info.textContent = formatTaskFileInfo(file);
  return info;
}

/**
 * Formats the file info text.
 * @param {Object} file
 * @returns {string}
 */
function formatTaskFileInfo(file) {
  const type = formatTaskFileType(file.type);
  const size = formatTaskFileSize(file.size);
  return `${type} · ${size}`;
}

/**
 * Formats a mime type for display.
 * @param {string} type
 * @returns {string}
 */
function formatTaskFileType(type) {
  const rawType = String(type || "image").split("/").pop() || "image";
  return rawType.toUpperCase();
}

/**
 * Formats file size for display.
 * @param {number} size
 * @returns {string}
 */
function formatTaskFileSize(size) {
  const bytes = Number(size) || 0;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

