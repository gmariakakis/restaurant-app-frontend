/**
 * Validates data for book creation.
 * @returns {boolean} - `true` if valid, `false` otherwise, with alerts.
 */
export const validateBookData = (title, author, year, genre) => {
    if (!title || !author || !year || !genre) {
        Alert.alert('Validation Error', 'All fields are required.');
        return false;
    }

    if (!/^\d{4}$/.test(year)) {
        Alert.alert('Validation Error', 'Published Year should be a valid 4-digit number.');
        return false;
    }

    return true;
};