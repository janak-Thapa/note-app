let base_url = '';

// Check if process is defined (Node.js environment)
if (typeof process !== 'undefined') {
    base_url = process.env.BASE_URL || '';
}

const _config = {
    base_url: base_url
};

export const constant = Object.freeze(_config);
