"""Service for managing biological network models via Cell Collective API."""
import json
import uuid
from typing import Dict, List, Any, Optional


class ModelService:
    """Service for managing biological network models.

    Integrates with Cell Collective via ccapi Python SDK.
    Provides simplified interface for K-12 students.
    """

    def __init__(self):
        """Initialize model service."""
        self.models = {}  # In-memory storage for demo
        # In production, would connect to Cell Collective via ccapi:
        # import ccapi
        # self.cc_client = ccapi.Client()

    def create_model(self, model_data: Dict) -> Dict:
        """Create a new biological network model.

        Args:
            model_data: Dictionary containing model structure
                {
                    'name': str,
                    'description': str,
                    'nodes': List[Dict],
                    'edges': List[Dict]
                }

        Returns:
            Created model with unique ID
        """
        model_id = str(uuid.uuid4())

        model = {
            'id': model_id,
            'name': model_data.get('name', 'Untitled Model'),
            'description': model_data.get('description', ''),
            'nodes': model_data.get('nodes', []),
            'edges': model_data.get('edges', []),
            'created_at': self._get_timestamp(),
            'updated_at': self._get_timestamp(),
            'version': 1
        }

        # Store in memory (demo)
        self.models[model_id] = model

        # In production, would save to Cell Collective:
        # cc_model = self._convert_to_cc_format(model)
        # cc_model = self.cc_client.create_model(cc_model)
        # model['cc_id'] = cc_model.id

        return {
            'success': True,
            'model': model
        }

    def get_model(self, model_id: str) -> Optional[Dict]:
        """Retrieve model by ID.

        Args:
            model_id: Unique model identifier

        Returns:
            Model data or None if not found
        """
        return self.models.get(model_id)

    def update_model(self, model_id: str, updates: Dict) -> Dict:
        """Update existing model.

        Args:
            model_id: Model to update
            updates: Dictionary of fields to update

        Returns:
            Updated model
        """
        if model_id not in self.models:
            return {'success': False, 'error': 'Model not found'}

        model = self.models[model_id]

        # Update fields
        if 'name' in updates:
            model['name'] = updates['name']
        if 'description' in updates:
            model['description'] = updates['description']
        if 'nodes' in updates:
            model['nodes'] = updates['nodes']
        if 'edges' in updates:
            model['edges'] = updates['edges']

        model['updated_at'] = self._get_timestamp()
        model['version'] += 1

        return {
            'success': True,
            'model': model
        }

    def delete_model(self, model_id: str) -> Dict:
        """Delete model.

        Args:
            model_id: Model to delete

        Returns:
            Success status
        """
        if model_id in self.models:
            del self.models[model_id]
            return {'success': True}
        return {'success': False, 'error': 'Model not found'}

    def simulate(self, model_id: str, params: Dict) -> Dict:
        """Run simulation on model.

        Args:
            model_id: Model to simulate
            params: Simulation parameters
                {
                    'steps': int,
                    'initial_conditions': Dict[str, int],
                    'update_scheme': 'synchronous' | 'asynchronous'
                }

        Returns:
            Simulation results with timeline
        """
        model = self.models.get(model_id)
        if not model:
            return {'success': False, 'error': 'Model not found'}

        # Initialize states
        state = self._initialize_state(model, params.get('initial_conditions', {}))

        # Run simulation
        steps = params.get('steps', 100)
        timeline = [state.copy()]

        for step in range(steps):
            state = self._update_state(model, state, params.get('update_scheme', 'synchronous'))
            timeline.append(state.copy())

            # Check for attractor (repeated state)
            if self._reached_attractor(timeline):
                break

        return {
            'success': True,
            'timeline': timeline,
            'steps_taken': len(timeline) - 1,
            'reached_attractor': self._reached_attractor(timeline),
            'final_state': timeline[-1]
        }

    def analyze(self, model_id: str) -> Dict:
        """Analyze network structure and properties.

        Args:
            model_id: Model to analyze

        Returns:
            Analysis results
        """
        model = self.models.get(model_id)
        if not model:
            return {'success': False, 'error': 'Model not found'}

        nodes = model['nodes']
        edges = model['edges']

        # Basic metrics
        analysis = {
            'success': True,
            'node_count': len(nodes),
            'edge_count': len(edges),
            'external_nodes': len([n for n in nodes if n.get('type') == 'external']),
            'internal_nodes': len([n for n in nodes if n.get('type') == 'internal']),
            'activation_edges': len([e for e in edges if e.get('type') == 'activation']),
            'inhibition_edges': len([e for e in edges if e.get('type') == 'inhibition']),
            'feedback_loops': self._find_feedback_loops(model),
            'complexity_score': self._calculate_complexity(model)
        }

        return analysis

    # Helper methods

    def _initialize_state(self, model: Dict, initial_conditions: Dict) -> Dict:
        """Initialize node states for simulation."""
        state = {}
        for node in model['nodes']:
            node_id = node['id']
            if node_id in initial_conditions:
                state[node_id] = initial_conditions[node_id]
            else:
                state[node_id] = node.get('state', 0)
        return state

    def _update_state(self, model: Dict, current_state: Dict, scheme: str) -> Dict:
        """Update states for one simulation step.

        Implements Boolean network update rules.
        """
        new_state = current_state.copy()

        # Build adjacency info
        regulators = {}  # target -> [(source, type)]
        for edge in model['edges']:
            target = edge['target']
            if target not in regulators:
                regulators[target] = []
            regulators[target].append((edge['source'], edge['type']))

        # Update each node
        for node in model['nodes']:
            node_id = node['id']

            if node.get('type') == 'external':
                # External nodes don't change (inputs)
                continue

            # Calculate new state based on regulators
            if node_id in regulators:
                new_state[node_id] = self._calculate_node_state(
                    current_state,
                    regulators[node_id]
                )

        return new_state

    def _calculate_node_state(self, current_state: Dict, regulators: List) -> int:
        """Calculate new state for a node based on its regulators.

        Simple rule: Node is ON if any activator is ON and no inhibitors are ON.
        """
        has_activation = False
        has_inhibition = False

        for source, edge_type in regulators:
            if current_state.get(source, 0) == 1:
                if edge_type == 'activation':
                    has_activation = True
                elif edge_type == 'inhibition':
                    has_inhibition = True

        # ON if activated and not inhibited
        if has_activation and not has_inhibition:
            return 1

        return 0

    def _reached_attractor(self, timeline: List[Dict]) -> bool:
        """Check if simulation reached a repeated state (attractor)."""
        if len(timeline) < 2:
            return False

        current = timeline[-1]
        for i in range(len(timeline) - 2, max(-1, len(timeline) - 11), -1):
            if timeline[i] == current:
                return True

        return False

    def _find_feedback_loops(self, model: Dict) -> List[Dict]:
        """Find feedback loops in network."""
        # Simplified implementation
        loops = []

        # Build adjacency list
        adj = {}
        for edge in model['edges']:
            source = edge['source']
            target = edge['target']
            if source not in adj:
                adj[source] = []
            adj[source].append(target)

        # DFS to find cycles
        visited = set()
        rec_stack = set()

        def dfs(node, path):
            visited.add(node)
            rec_stack.add(node)

            if node in adj:
                for neighbor in adj[node]:
                    if neighbor in path:
                        # Found loop
                        loop_start = path.index(neighbor)
                        loop = path[loop_start:] + [neighbor]
                        loops.append({
                            'nodes': loop,
                            'length': len(loop) - 1
                        })
                    elif neighbor not in visited:
                        dfs(neighbor, path + [neighbor])

            rec_stack.remove(node)

        for node in model['nodes']:
            node_id = node['id']
            if node_id not in visited:
                dfs(node_id, [node_id])

        return loops

    def _calculate_complexity(self, model: Dict) -> float:
        """Calculate model complexity score."""
        node_count = len(model['nodes'])
        edge_count = len(model['edges'])

        # Simple complexity metric
        return (node_count + edge_count * 2) / 10

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.now().isoformat()

    def _convert_to_cc_format(self, model: Dict) -> Dict:
        """Convert CellQuest model to Cell Collective format.

        This would be used when integrating with actual ccapi.
        """
        # Placeholder for production implementation
        return model


# Singleton instance
model_service = ModelService()
