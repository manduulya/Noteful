export const findFolder = (folders = [], folderId) => {
  if (!folderId) return;
  return folders.find((folder) => folder.id.toString() === folderId.toString());
};

export const findNote = (notes = [], noteId) => {
  if (!noteId) return;
  return notes.find((note) => note.id.toString() === noteId.toString());
};

export const getNotesForFolder = (notes = [], folderId) =>
  !folderId
    ? notes
    : notes.filter((note) => note.folderId.toString() === folderId.toString());

export const countNotesForFolder = (notes = [], folderId) =>
  notes.filter((note) => note.folderId === folderId).length;
