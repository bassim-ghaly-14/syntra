/**
 * Comprehensive input sanitization and validation module
 * Prevents XSS vulnerabilities and ensures data integrity
 */

const allowedHTMLTags = ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h3'];
const allowedAttributes = ['class', 'id', 'style'];

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized text content
 */
export function sanitizeHTML(input) {
    if (typeof input !== 'string') {
        return '';
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'text/html');
        
        // Return text content only (strips all HTML)
        return doc.body.textContent || '';
    } catch (error) {
        console.warn('HTML sanitization failed:', error);
        return '';
    }
}

/**
 * Sanitize HTML while preserving safe formatting tags
 * @param {string} input - The input string
 * @returns {string} - HTML with only safe tags preserved
 */
export function sanitizeHTMLPreserveTags(input) {
    if (typeof input !== 'string') {
        return '';
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'text/html');
        const walker = doc.createTreeWalker(
            doc.body,
            NodeFilter.SHOW_ALL,
            null,
            false
        );

        const result = document.createElement('div');
        let node;

        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                result.appendChild(document.createTextNode(node.textContent));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (allowedHTMLTags.includes(node.tagName.toLowerCase())) {
                    const clone = node.cloneNode(true);
                    // Remove disallowed attributes
                    Array.from(clone.attributes).forEach(attr => {
                        if (!allowedAttributes.includes(attr.name)) {
                            clone.removeAttribute(attr.name);
                        }
                    });
                    result.appendChild(clone);
                } else {
                    // Replace with text content for disallowed tags
                    result.appendChild(document.createTextNode(node.textContent));
                }
            }
        }

        return result.innerHTML;
    } catch (error) {
        console.warn('HTML preservation sanitization failed:', error);
        return sanitizeHTML(input);
    }
}

/**
 * Validate page ID against whitelist
 * @param {string} pageId - The page ID to validate
 * @returns {boolean} - Whether the page ID is valid
 */
export function validatePageId(pageId) {
    const validPages = ['dashboard', 'analytics', 'reports', 'activity', 'users', 'settings'];
    
    if (typeof pageId !== 'string') {
        return false;
    }

    return validPages.includes(pageId.toLowerCase().trim());
}

/**
 * Validate and sanitize search input
 * @param {string} input - The search input
 * @returns {string} - Sanitized search string
 */
export function validateSearchInput(input) {
    if (typeof input !== 'string') {
        return '';
    }

    // Remove special characters, limit length
    const sanitized = input
        .trim()
        .slice(0, 100)
        .replace(/[<>\"']/g, '');

    return sanitized;
}

/**
 * Validate JSON data structure
 * @param {string} jsonString - The JSON string to validate
 * @returns {object|null} - Parsed object or null if invalid
 */
export function validateJSON(jsonString) {
    try {
        if (typeof jsonString !== 'string') {
            return null;
        }

        const parsed = JSON.parse(jsonString);
        
        // Check for expected structure
        if (typeof parsed !== 'object' || parsed === null) {
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn('JSON validation failed:', error);
        return null;
    }
}

/**
 * Validate file name for export
 * @param {string} fileName - The file name to validate
 * @returns {string} - Sanitized file name
 */
export function validateFileName(fileName) {
    if (typeof fileName !== 'string') {
        return 'export';
    }

    // Remove path separators and special characters
    const sanitized = fileName
        .replace(/[\/\\:*?"<>|]/g, '')
        .trim()
        .slice(0, 50);

    return sanitized || 'export';
}

/**
 * Create safe DOM element with text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content
 * @param {string} className - CSS class name (optional)
 * @returns {HTMLElement} - Created element
 */
export function createSafeElement(tag, text, className = '') {
    const element = document.createElement(tag);
    element.textContent = text; // Safe: uses textContent, not innerHTML
    if (className) {
        element.className = className;
    }
    return element;
}

/**
 * Check if input appears to be HTML
 * @param {string} input - Input to check
 * @returns {boolean} - Whether input contains HTML tags
 */
export function containsHTML(input) {
    if (typeof input !== 'string') {
        return false;
    }

    return /<[^>]*>/g.test(input);
}
