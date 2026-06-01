/**
 * Lifecycle management for component cleanup and event listener tracking
 * Prevents memory leaks and ensures proper cleanup on navigation
 */

class LifecycleManager {
    constructor() {
        this.listeners = new Map();
        this.intervals = new Set();
        this.observers = new Set();
        this.promises = new Set();
        this.isActive = false;
    }

    /**
     * Initialize lifecycle for a component
     */
    activate() {
        this.isActive = true;
    }

    /**
     * Cleanup all registered listeners, intervals, and observers
     */
    deactivate() {
        this.isActive = false;
        
        // Remove all event listeners
        this.listeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        this.listeners.clear();

        // Clear all intervals
        this.intervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.intervals.clear();

        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        this.observers.clear();

        // Abort all pending promises
        this.promises.forEach(controller => {
            if (controller) {
                controller.abort();
            }
        });
        this.promises.clear();
    }

    /**
     * Register an event listener for automatic cleanup
     * @param {HTMLElement} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler function
     * @param {object} options - Event listener options
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element || !event || !handler) {
            return;
        }

        element.addEventListener(event, handler, options);
        this.listeners.set(`${event}-${Math.random()}`, {
            element,
            event,
            handler
        });
    }

    /**
     * Register an interval for automatic cleanup
     * @param {Function} callback - Function to execute
     * @param {number} delay - Delay in milliseconds
     * @returns {number} - Interval ID
     */
    setInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervals.add(intervalId);
        return intervalId;
    }

    /**
     * Stop and remove a specific interval
     * @param {number} intervalId - Interval ID
     */
    clearInterval(intervalId) {
        clearInterval(intervalId);
        this.intervals.delete(intervalId);
    }

    /**
     * Register an observer for automatic cleanup
     * @param {MutationObserver|ResizeObserver|IntersectionObserver} observer - Observer instance
     */
    registerObserver(observer) {
        if (observer) {
            this.observers.add(observer);
        }
    }

    /**
     * Create and register an AbortController for fetch operations
     * @returns {AbortController} - Abort controller for use with fetch
     */
    createAbortController() {
        const controller = new AbortController();
        this.promises.add(controller);
        return controller;
    }

    /**
     * Check if lifecycle is still active
     * @returns {boolean} - Whether lifecycle is active
     */
    isAlive() {
        return this.isActive;
    }

    /**
     * Get lifecycle status for debugging
     * @returns {object} - Status information
     */
    getStatus() {
        return {
            isActive: this.isActive,
            listeners: this.listeners.size,
            intervals: this.intervals.size,
            observers: this.observers.size,
            promises: this.promises.size
        };
    }
}

// Global lifecycle manager for the application
const globalLifecycleManager = new LifecycleManager();

export { LifecycleManager, globalLifecycleManager };
