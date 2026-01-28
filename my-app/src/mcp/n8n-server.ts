#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

interface N8nConfig {
  apiUrl: string;
  apiKey: string;
}

// Lade Konfiguration aus Umgebungsvariablen
function getN8nConfig(): N8nConfig {
  const apiUrl = process.env.N8N_API_URL || "http://localhost:5678";
  const apiKey = process.env.N8N_API_KEY || "";

  if (!apiKey) {
    console.warn("WARNUNG: N8N_API_KEY nicht gesetzt. Einige Funktionen funktionieren möglicherweise nicht.");
  }

  return { apiUrl, apiKey };
}

const config = getN8nConfig();

// n8n API Helper-Funktionen
async function n8nApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${config.apiUrl.replace(/\/$/, "")}${endpoint}`;
  const headers = {
    "X-N8N-API-KEY": config.apiKey,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`n8n API Fehler: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// MCP Server erstellen
const server = new Server(
  {
    name: "n8n-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tools auflisten
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_workflows",
        description: "Listet alle verfügbaren n8n Workflows auf",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_workflow",
        description: "Ruft Details eines spezifischen Workflows ab",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Die ID des Workflows",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "execute_workflow",
        description: "Führt einen n8n Workflow aus",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Die ID des Workflows",
            },
            inputData: {
              type: "object",
              description: "Eingabedaten für den Workflow (optional)",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "create_workflow",
        description: "Erstellt einen neuen n8n Workflow",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name des Workflows",
            },
            nodes: {
              type: "array",
              description: "Array von Workflow-Nodes",
            },
            connections: {
              type: "object",
              description: "Verbindungen zwischen Nodes",
            },
          },
          required: ["name", "nodes"],
        },
      },
      {
        name: "update_workflow",
        description: "Aktualisiert einen bestehenden Workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Die ID des Workflows",
            },
            name: {
              type: "string",
              description: "Neuer Name des Workflows (optional)",
            },
            nodes: {
              type: "array",
              description: "Array von Workflow-Nodes (optional)",
            },
            connections: {
              type: "object",
              description: "Verbindungen zwischen Nodes (optional)",
            },
            active: {
              type: "boolean",
              description: "Ob der Workflow aktiv sein soll (optional)",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "delete_workflow",
        description: "Löscht einen Workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Die ID des Workflows",
            },
          },
          required: ["workflowId"],
        },
      },
      {
        name: "get_workflow_executions",
        description: "Ruft die Ausführungs-Historie eines Workflows ab",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Die ID des Workflows",
            },
            limit: {
              type: "number",
              description: "Maximale Anzahl von Ausführungen (Standard: 10)",
            },
          },
          required: ["workflowId"],
        },
      },
    ],
  };
});

// Tool-Aufrufe verarbeiten
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_workflows": {
        const workflows = await n8nApiRequest("/api/v1/workflows");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflows, null, 2),
            },
          ],
        };
      }

      case "get_workflow": {
        const { workflowId } = args as { workflowId: string };
        const workflow = await n8nApiRequest(`/api/v1/workflows/${workflowId}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      }

      case "execute_workflow": {
        const { workflowId, inputData } = args as {
          workflowId: string;
          inputData?: any;
        };
        const result = await n8nApiRequest(`/api/v1/workflows/${workflowId}/execute`, {
          method: "POST",
          body: JSON.stringify(inputData || {}),
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_workflow": {
        const { name, nodes, connections, active } = args as {
          name: string;
          nodes: any[];
          connections?: any;
          active?: boolean;
        };
        const workflow = await n8nApiRequest("/api/v1/workflows", {
          method: "POST",
          body: JSON.stringify({
            name,
            nodes,
            connections: connections || {},
            active: active !== undefined ? active : false,
          }),
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      }

      case "update_workflow": {
        const { workflowId, ...updates } = args as {
          workflowId: string;
          name?: string;
          nodes?: any[];
          connections?: any;
          active?: boolean;
        };
        const workflow = await n8nApiRequest(`/api/v1/workflows/${workflowId}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      }

      case "delete_workflow": {
        const { workflowId } = args as { workflowId: string };
        await n8nApiRequest(`/api/v1/workflows/${workflowId}`, {
          method: "DELETE",
        });
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${workflowId} wurde erfolgreich gelöscht.`,
            },
          ],
        };
      }

      case "get_workflow_executions": {
        const { workflowId, limit = 10 } = args as {
          workflowId: string;
          limit?: number;
        };
        const executions = await n8nApiRequest(
          `/api/v1/executions?workflowId=${workflowId}&limit=${limit}`
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(executions, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unbekanntes Tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Fehler: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Resources auflisten
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const workflows = await n8nApiRequest("/api/v1/workflows");
    const workflowList = Array.isArray(workflows) ? workflows : workflows.data || [];

    return {
      resources: workflowList.map((workflow: any) => ({
        uri: `workflow://${workflow.id}`,
        name: workflow.name || `Workflow ${workflow.id}`,
        description: workflow.description || "",
        mimeType: "application/json",
      })),
    };
  } catch (error) {
    return {
      resources: [],
    };
  }
});

// Resource lesen
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^workflow:\/\/(.+)$/);

  if (!match) {
    throw new Error(`Ungültige Resource URI: ${uri}`);
  }

  const workflowId = match[1];
  const workflow = await n8nApiRequest(`/api/v1/workflows/${workflowId}`);

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(workflow, null, 2),
      },
    ],
  };
});

// Server starten
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("n8n MCP Server läuft und wartet auf Anfragen...");
}

main().catch((error) => {
  console.error("Fehler beim Starten des MCP Servers:", error);
  process.exit(1);
});

