import { API_BASE_URL } from '../utils/apiConfig';

/**
 * Fetches all books (with optional pagination).
 */
export const fetchBooks = async (limit = null, offset = 0) => {
    try {
        let url = `${API_BASE_URL}/books`;

        const params = [];
        if (limit !== null) params.push(`limit=${limit}`);
        if (offset > 0) params.push(`offset=${offset}`);
        if (params.length) url += `?${params.join('&')}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch books');

        return data;
    } catch (error) {
        throw new Error(`fetchBooks: ${error.message}`);
    }
};

/**
 * Fetch a single book by UUID.
 */
export const fetchBookById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Book not found');

        return data;
    } catch (error) {
        throw new Error(`fetchBookById: ${error.message}`);
    }
};

/**
 * Create a new book (requires access token).
 */
export const createBook = async (book, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(book),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create book');

        return data;
    } catch (error) {
        throw new Error(`createBook: ${error.message}`);
    }
};

/**
 * Update an existing book by ID (requires access token).
 */
export const updateBook = async (id, updatedBook, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedBook),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update book');

        return data;
    } catch (error) {
        throw new Error(`updateBook: ${error.message}`);
    }
};

/**
 * Delete a book by UUID (requires access token).
 */
export const deleteBook = async (id, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete book');
        }

        return true;
    } catch (error) {
        throw new Error(`deleteBook: ${error.message}`);
    }
};
