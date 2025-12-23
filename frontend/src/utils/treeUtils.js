import { getParentPath } from "./getParentPath";

/**
 * Builds a tree structure from a flat list of files/folders
 * Time complexity: O(n) where n is the number of files
 * 
 * @param {Array} flatList - Flat array of file objects with {name, path, isDirectory, ...}
 * @returns {Array} Array of root nodes with children property
 */
export const buildTree = (flatList) => {
  if (!Array.isArray(flatList) || flatList.length === 0) {
    return [];
  }

  // Create a map for O(1) lookup: path -> node
  const nodeMap = new Map();
  const rootNodes = [];

  // First pass: create all nodes
  flatList.forEach((file) => {
    const node = {
      ...file,
      children: [],
    };
    nodeMap.set(file.path, node);
  });

  // Second pass: build parent-child relationships
  flatList.forEach((file) => {
    const node = nodeMap.get(file.path);
    const parentPath = getParentPath(file.path);

    if (parentPath === "" || !nodeMap.has(parentPath)) {
      // Root node
      rootNodes.push(node);
    } else {
      // Child node
      const parent = nodeMap.get(parentPath);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootNodes;
};

/**
 * Finds a node in the tree by its path
 * Time complexity: O(n) worst case, but optimized with path-based lookup
 * 
 * @param {Array} tree - Tree structure (array of root nodes)
 * @param {string} targetPath - Path to find
 * @returns {Object|null} Found node or null
 */
export const findNodeByPath = (tree, targetPath) => {
  if (!targetPath || !Array.isArray(tree)) {
    return null;
  }

  // Direct lookup using path segments for better performance
  const pathSegments = targetPath.split("/").filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null;
  }

  let currentNode = null;
  let currentPath = "";

  // Navigate through the tree following the path
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const nextPath = currentPath ? `${currentPath}/${segment}` : segment;

    const searchInNodes = (nodes) => {
      for (const node of nodes) {
        if (node.path === nextPath) {
          return node;
        }
      }
      return null;
    };

    if (i === 0) {
      currentNode = searchInNodes(tree);
    } else if (currentNode && Array.isArray(currentNode.children)) {
      currentNode = searchInNodes(currentNode.children);
    } else {
      return null;
    }

    if (!currentNode) {
      return null;
    }

    currentPath = nextPath;
  }

  return currentNode;
};

/**
 * Searches for files/folders within a subtree that match the keyword
 * Time complexity: O(m) where m is the number of nodes in the subtree
 * 
 * @param {Object} node - Root node of the subtree to search
 * @param {string} keyword - Search keyword (case-insensitive)
 * @param {Array} flatList - Flat list for fast filtering (optional, for optimization)
 * @returns {Array} Array of matching file objects
 */
export const searchInSubtree = (node, keyword, flatList = null) => {
  if (!node || !keyword) {
    return [];
  }

  const query = keyword.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const results = [];

  // Helper function to recursively search
  const searchRecursive = (currentNode) => {
    if (!currentNode) return;

    // Check if current node matches
    const pathMatch = currentNode.path?.toLowerCase().includes(query);
    const nameMatch = currentNode.name?.toLowerCase().includes(query);

    if (pathMatch || nameMatch) {
      results.push({
        name: currentNode.name,
        path: currentNode.path,
        isDirectory: currentNode.isDirectory,
        updatedAt: currentNode.updatedAt,
        size: currentNode.size,
      });
    }

    // Recursively search children
    if (Array.isArray(currentNode.children)) {
      currentNode.children.forEach((child) => {
        searchRecursive(child);
      });
    }
  };

  searchRecursive(node);
  return results;
};

/**
 * Gets all descendant paths from a given node (for fast flat list filtering)
 * Time complexity: O(m) where m is the number of descendants
 * 
 * @param {Object} node - Root node
 * @returns {Set} Set of all descendant paths including the node itself
 */
export const getSubtreePaths = (node) => {
  if (!node) {
    return new Set();
  }

  const paths = new Set([node.path]);

  const collectPaths = (currentNode) => {
    if (Array.isArray(currentNode.children)) {
      currentNode.children.forEach((child) => {
        paths.add(child.path);
        collectPaths(child);
      });
    }
  };

  collectPaths(node);
  return paths;
};

