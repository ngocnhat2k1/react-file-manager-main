import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useFiles } from "./FilesContext";
import { searchInSubtree, getSubtreePaths } from "../utils/treeUtils";
import { normalizeForSearch } from "../utils/vietnameseUtils";
import sortFiles from "../utils/sortFiles";

const FileNavigationContext = createContext();

export const FileNavigationProvider = ({ children, initialPath }) => {
  const { files, tree, getNodeByPath } = useFiles();
  const isMountRef = useRef(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPathFiles, setCurrentPathFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (Array.isArray(files) && files.length > 0) {
      // When searching, only search within current folder's subtree
      if (searchTerm.trim()) {
        const query = normalizeForSearch(searchTerm.trim());

        // If at root (currentPath is empty), search entire flat list
        if (!currentPath) {
          const matchedFiles = files.filter((file) => {
            // Normalize both path and name for comparison (supports Vietnamese without diacritics)
            const normalizedPath = normalizeForSearch(file.path || "");
            const normalizedName = normalizeForSearch(file.name || "");
            return (
              normalizedPath.includes(query) || normalizedName.includes(query)
            );
          });
          setCurrentPathFiles(() => sortFiles(matchedFiles));
          setCurrentFolder(null);
          return;
        }

        // If inside a folder, search only within its subtree
        const searchRootNode = getNodeByPath(currentPath);
        if (searchRootNode) {
          const matchedFiles = searchInSubtree(searchRootNode, searchTerm);
          setCurrentPathFiles(() => sortFiles(matchedFiles));
        } else {
          // Current path not found in tree, return empty
          setCurrentPathFiles([]);
        }
        setCurrentFolder(null);
        return;
      }

      // Default: show files in currentPath
      setCurrentPathFiles(() => {
        const currPathFiles = files.filter(
          (file) => file.path === `${currentPath}/${file.name}`
        );
        return sortFiles(currPathFiles);
      });

      setCurrentFolder(() => {
        return files.find((file) => file.path === currentPath) ?? null;
      });
    }
  }, [files, currentPath, searchTerm, tree, getNodeByPath]);

  useEffect(() => {
    if (!isMountRef.current && Array.isArray(files) && files.length > 0) {
      setCurrentPath(
        files.some((file) => file.path === initialPath) ? initialPath : ""
      );
      isMountRef.current = true;
    }
  }, [initialPath, files]);

  return (
    <FileNavigationContext.Provider
      value={{
        currentPath,
        setCurrentPath,
        currentFolder,
        setCurrentFolder,
        currentPathFiles,
        setCurrentPathFiles,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </FileNavigationContext.Provider>
  );
};

export const useFileNavigation = () => useContext(FileNavigationContext);
