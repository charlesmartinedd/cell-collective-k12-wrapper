/**
 * Cell Collective K-12 Educational Wrapper JavaScript
 * Simplifies interactions for K-12 students
 * Version: 1.0
 */

class CellCollectiveK12Wrapper {
    constructor() {
        this.version = '1.0';
        this.mode = 'student';
        this.init();
    }

    init() {
        console.log('Cell Collective K-12 Wrapper v' + this.version + ' initialized');

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Setting up K-12 wrapper...');

        // Add K-12 header
        this.addK12Header();

        // Enhance New Model button
        this.setupNewModelButton();

        // Make model cards more accessible
        this.setupModelCards();

        // Hide complex features
        this.hideComplexFeatures();

        // Add help tooltips
        this.addHelpTooltips();

        console.log('K-12 wrapper setup complete');
    }

    /**
     * Add K-12 branded header
     */
    addK12Header() {
        const header = document.createElement('div');
        header.id = 'k12-header';
        header.innerHTML = `
            <div class="logo">Cell Collective - Student Edition</div>
            <button class="help-btn" onclick="window.cellCollectiveK12.showHelp()">
                Need Help?
            </button>
        `;

        document.body.insertBefore(header, document.body.firstChild);

        // Adjust body padding to account for fixed header
        document.body.style.paddingTop = '60px';
    }

    /**
     * Enhance "New Model" button for K-12 use
     */
    setupNewModelButton() {
        const btn = document.querySelector('.btn-new-model');
        if (btn) {
            // Add helpful tooltip
            btn.title = 'Create a new biological model';

            // Add descriptive text
            btn.setAttribute('aria-label', 'Create new biological model - Start building your own cell signaling pathways');

            // Log click for analytics
            btn.addEventListener('click', () => {
                console.log('Student clicked "New Model"');
            });
        }
    }

    /**
     * Make model cards more accessible
     */
    setupModelCards() {
        const cards = document.querySelectorAll('.card-content');

        cards.forEach((card, index) => {
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Open model ${index + 1}`);

            // Add keyboard handler
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Add hover effect description
            const cardTitle = card.querySelector('.card-title, h3, h4');
            if (cardTitle) {
                card.setAttribute('aria-label', `Open model: ${cardTitle.textContent}`);
            }
        });

        console.log(`Enhanced ${cards.length} model cards for accessibility`);
    }

    /**
     * Hide complex features not needed for K-12
     */
    hideComplexFeatures() {
        // Override merge functions (advanced feature)
        if (window.mergeModels) {
            window.mergeModels = () => {
                this.showMessage('This advanced feature is not available in student mode. Ask your teacher for help!');
            };
        }

        if (window.mergeModelsSelector) {
            window.mergeModelsSelector = () => {
                this.showMessage('This advanced feature is not available in student mode. Ask your teacher for help!');
            };
        }

        if (window.initiateMergeModels) {
            window.initiateMergeModels = () => {
                this.showMessage('This advanced feature is not available in student mode. Ask your teacher for help!');
            };
        }
    }

    /**
     * Add helpful tooltips to elements
     */
    addHelpTooltips() {
        // Add tooltips to common elements
        const tooltips = {
            '.btn-new-model': 'Create a new biological model from scratch',
            '.card-content': 'Click to open this model and explore how it works',
            '.menu': 'Navigation menu - find different sections here'
        };

        Object.entries(tooltips).forEach(([selector, tooltip]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!el.title) {
                    el.title = tooltip;
                }
            });
        });
    }

    /**
     * Show help modal
     */
    showHelp() {
        const helpContent = `
            <h2>Cell Collective Student Help</h2>
            <h3>Getting Started</h3>
            <ul>
                <li><strong>View Models:</strong> Click on any model card to explore it</li>
                <li><strong>Create New Model:</strong> Click the green "New Model" button</li>
                <li><strong>Need Teacher Help:</strong> Ask your teacher for assistance</li>
            </ul>
            <h3>Tips</h3>
            <ul>
                <li>Take your time exploring each model</li>
                <li>Try running simulations to see how models work</li>
                <li>Save your work frequently</li>
            </ul>
        `;

        this.showModal('Help', helpContent);
    }

    /**
     * Show a modal with custom content
     */
    showModal(title, content) {
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <h2 style="margin-top: 0;">${title}</h2>
                <div>${content}</div>
                <button onclick="this.closest('[style]').remove()" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Show a temporary message
     */
    showMessage(message, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10002;
            animation: slideDown 0.3s ease-out;
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, duration);
    }

    /**
     * Create new model with optional template
     * @param {string} templateId - Optional template ID for pre-built models
     */
    createNewModel(templateId = null) {
        if (templateId) {
            console.log(`Loading template: ${templateId}`);
            // Would need API integration here
        }

        if (window.redirectToNewModel) {
            window.redirectToNewModel();
        } else {
            // Fallback
            window.location.href = '/research/model/new';
        }
    }

    /**
     * Open existing model
     * @param {string} modelId - Model ID to open
     */
    openModel(modelId) {
        window.location.href = `/research/model/${modelId}`;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize wrapper
window.cellCollectiveK12 = new CellCollectiveK12Wrapper();

// Make available globally for debugging
console.log('K-12 Wrapper available at: window.cellCollectiveK12');
