"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Panel,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore } from "../store/editor.store";
import { Button } from "@/components/ui/button";
import NodesSidebar from "./nodes-sidebar";
import { NodeType } from "@/generated/prisma/enums";
import { createId } from "@paralleldrive/cuid2";
import { NodeTypes } from "../config/node-types";
import SaveButton from "./save-button";
import StartWorkflowManually from "./start-workflow-manually-btn";
import GenerateWorkflow from "./generate-workflow";
import { useParams } from "next/navigation";

export default function WorkflowEditor() {
  const {id} = useParams<{id:string}>()
  const { edges, nodes, onNodesChange, onEdgesChange, onConnect, addNode } =
    useEditorStore();
  const handleAddNode = (type: NodeType) => {
    addNode({
      type,
      data: {},
      position: { x: 50, y: 50 },
      id: createId(),
    });
  };
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={NodeTypes}
    >
      <Background />
      <Panel position={"top-right"}>
        <NodesSidebar onSelect={handleAddNode} existingNodes={nodes}>
          <Button>Add Node</Button>
        </NodesSidebar>
      </Panel>
      <Panel position="bottom-center" className="flex items-center gap-2"> 
      <SaveButton/>
      <StartWorkflowManually/>
      </Panel>
      <Panel position="top-left"><GenerateWorkflow id={id}/></Panel>
    </ReactFlow>
  );
}
