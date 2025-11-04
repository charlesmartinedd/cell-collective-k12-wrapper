/**
 * Cell Collective API Integration
 * Connects to research.cellcollective.org
 */

const API_BASE = 'https://research.cellcollective.org/web/_api';

export interface CellCollectiveMetadata {
  definitionMap: {
    [key: string]: {
      name: string;
      type: string;
      visibleAll: boolean;
    };
  };
  metadataValueRangeMap: {
    [key: string]: {
      definitionId: number;
      value: string;
    };
  };
}

export class CellCollectiveAPI {
  /**
   * Initialize session and get platform metadata
   * Endpoint: GET /web/_api/initialize
   */
  async initialize(): Promise<CellCollectiveMetadata> {
    const response = await fetch(`${API_BASE}/initialize`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get target audience levels (Kindergarten through Graduate)
   */
  async getTargetAudiences(): Promise<string[]> {
    const data = await this.initialize();
    const audiences: string[] = [];

    // Extract target audience values from metadata
    Object.values(data.metadataValueRangeMap).forEach((item) => {
      if (item.definitionId === 1) { // TargetAudience definition ID
        audiences.push(item.value);
      }
    });

    return audiences;
  }

  /**
   * Get learning types (Investigation, Editing, etc.)
   */
  async getLearningTypes(): Promise<string[]> {
    const data = await this.initialize();
    const types: string[] = [];

    Object.values(data.metadataValueRangeMap).forEach((item) => {
      if (item.definitionId === 2) { // LearningType definition ID
        types.push(item.value);
      }
    });

    return types;
  }

  // TODO: Add methods when we discover model endpoints:
  // - getModels()
  // - getModel(id)
  // - createModel(data)
  // - runSimulation(modelId, params)
  // - getSimulationResults(simulationId)
}

export const cellCollectiveAPI = new CellCollectiveAPI();
