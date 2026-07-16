// stores/use-editor.ts
import { create } from "zustand";
import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge
} from "@xyflow/react";

interface EditorStore {
  nodes: Node[];
  edges: Edge[];

  // Getters
  getNodes: () => Node[];
  getEdges: () => Edge[];

  // Setters
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;

  // React Flow helpers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // Single item helpers
  getNode: (id: string) => Node | undefined;
  getEdge: (id: string) => Edge | undefined;

  updateNode: (id: string, updater: (node: Node) => Node) => void;
  updateEdge: (id: string, updater: (edge: Edge) => Edge) => void;

  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;

  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;

  onConnect: (connection: Connection) => void;

  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  nodes: [],
  edges: [],

  // Getters
  getNodes: () => get().nodes,
  getEdges: () => get().edges,

  // Setters
  setNodes: (nodes) =>
    set((state) => ({
      nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
    })),

  setEdges: (edges) =>
    set((state) => ({
      edges: typeof edges === "function" ? edges(state.edges) : edges,
    })),

  // React Flow callbacks
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  // Find
  getNode: (id) => get().nodes.find((n) => n.id === id),
  getEdge: (id) => get().edges.find((e) => e.id === id),

  // Update
  updateNode: (id, updater) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? updater(node) : node
      ),
    })),

  updateEdge: (id, updater) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? updater(edge) : edge
      ),
    })),

  // Add
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  // Remove
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter(
        (e) => e.source !== id && e.target !== id
      ),
    })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    })),
    onConnect: (connection) =>
  set((state) => ({
    edges: addEdge(connection, state.edges),
  })),

  reset: () =>
    set({
      nodes: [],
      edges: [],
    }),
}));