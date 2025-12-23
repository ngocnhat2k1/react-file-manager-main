import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildTree, findNodeByPath } from "../utils/treeUtils";

const FilesContext = createContext();

export const FilesProvider = ({ children, filesData, onError }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(filesData || []);
  }, [filesData]);

  // Build tree structure from flat list (memoized for performance)
  const tree = useMemo(() => {
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }
    return buildTree(files);
  }, [files]);

  const getChildren = (file) => {
    if (!file.isDirectory) return [];
    return files.filter((child) => child.path === `${file.path}/${child.name}`);
  };

  // Find node in tree by path
  const getNodeByPath = (path) => {
    return findNodeByPath(tree, path);
  };

  // Search in entire tree (legacy support, but prefer searchInSubtree)
  const searchByPath = (query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return files.filter((file) => file.path.toLowerCase().includes(q));
  };

  return (
    <FilesContext.Provider
      value={{
        files,
        setFiles,
        tree,
        getChildren,
        getNodeByPath,
        searchByPath,
        onError,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => useContext(FilesContext);
