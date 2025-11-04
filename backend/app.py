"""CellQuest Backend API - Flask application with Socket.IO."""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time

from config import config
from model_service import model_service

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config['development'])

# Enable CORS
CORS(app, origins=app.config['CORS_ORIGINS'])

# Initialize Socket.IO
socketio = SocketIO(
    app,
    cors_allowed_origins=app.config['CORS_ORIGINS'],
    async_mode=app.config['SOCKETIO_ASYNC_MODE']
)


# ==================== REST API Routes ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'CellQuest API'})


@app.route('/api/models', methods=['POST'])
def create_model():
    """Create a new biological network model."""
    try:
        data = request.json
        result = model_service.create_model(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/models/<model_id>', methods=['GET'])
def get_model(model_id):
    """Get model by ID."""
    try:
        model = model_service.get_model(model_id)
        if model:
            return jsonify({'success': True, 'model': model})
        return jsonify({'success': False, 'error': 'Model not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/models/<model_id>', methods=['PUT'])
def update_model(model_id):
    """Update existing model."""
    try:
        updates = request.json
        result = model_service.update_model(model_id, updates)
        if result['success']:
            return jsonify(result)
        return jsonify(result), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/models/<model_id>', methods=['DELETE'])
def delete_model(model_id):
    """Delete model."""
    try:
        result = model_service.delete_model(model_id)
        if result['success']:
            return jsonify(result)
        return jsonify(result), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/models/<model_id>/simulate', methods=['POST'])
def simulate_model(model_id):
    """Run simulation on model."""
    try:
        params = request.json
        result = model_service.simulate(model_id, params)
        if result['success']:
            return jsonify(result)
        return jsonify(result), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/models/<model_id>/analyze', methods=['GET'])
def analyze_model(model_id):
    """Analyze model network structure."""
    try:
        result = model_service.analyze(model_id)
        if result['success']:
            return jsonify(result)
        return jsonify(result), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== WebSocket Events ====================

@socketio.on('connect')
def handle_connect():
    """Handle client connection."""
    print('Client connected')
    emit('connection_response', {'status': 'connected'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection."""
    print('Client disconnected')


@socketio.on('start_simulation')
def handle_simulation(data):
    """Run real-time simulation with step-by-step updates.

    Args:
        data: {
            'model_id': str,
            'params': {
                'steps': int,
                'initial_conditions': dict,
                'step_delay': float  # seconds between steps
            }
        }
    """
    try:
        model_id = data['model_id']
        params = data['params']

        # Get model
        model = model_service.get_model(model_id)
        if not model:
            emit('simulation_error', {'error': 'Model not found'})
            return

        # Initialize state
        state = model_service._initialize_state(
            model,
            params.get('initial_conditions', {})
        )

        # Emit initial state
        emit('simulation_step', {
            'step': 0,
            'state': state
        })

        # Run simulation step-by-step
        steps = params.get('steps', 100)
        step_delay = params.get('step_delay', 0.5)

        for step in range(1, steps + 1):
            time.sleep(step_delay)  # Delay for visualization

            # Update state
            state = model_service._update_state(
                model,
                state,
                params.get('update_scheme', 'synchronous')
            )

            # Emit current state
            emit('simulation_step', {
                'step': step,
                'state': state
            })

            # Check for attractor
            # (simplified - in production would track full timeline)

        # Emit completion
        emit('simulation_complete', {
            'success': True,
            'final_state': state
        })

    except Exception as e:
        emit('simulation_error', {'error': str(e)})


@socketio.on('stop_simulation')
def handle_stop_simulation():
    """Stop running simulation."""
    # In production, would track and cancel running simulations
    emit('simulation_stopped', {'success': True})


# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


# ==================== Main ====================

if __name__ == '__main__':
    print('=' * 60)
    print('🧬 CellQuest Backend API')
    print('=' * 60)
    print(f'Server: http://{app.config["HOST"]}:{app.config["PORT"]}')
    print(f'Environment: {app.config["ENV"]}')
    print(f'Debug: {app.config["DEBUG"]}')
    print('=' * 60)

    socketio.run(
        app,
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
