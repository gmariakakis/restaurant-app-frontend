// src/styles/restaurantStyles.js
export default {
    /* Generic containers */
    container:   { flex: 1, padding: 16, backgroundColor: '#F7F7F7' },

    /* Cards & list rows */
    card:        {
        flexDirection: 'row',
        alignItems:    'center',
        padding:       16,
        backgroundColor: '#FFF',
        borderRadius:  8,
        marginHorizontal: 8,
        marginVertical:   4,
        shadowColor:   '#000',
        shadowOpacity: 0.06,
        shadowRadius:  4,
        elevation:     2,
    },

    /* Typography */
    title:       { fontSize: 18, fontWeight: 'bold', color: '#222' },
    subtitle:    { fontSize: 14, color: '#555' },
};
