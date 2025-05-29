import React, { useContext, useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { createBook } from '../api/booksApi';
import { useNavigation } from '@react-navigation/native';
import { validateBookData } from '../utils/validators';
import { bookStyles as styles } from '../styles/bookStyles';

const AddBookScreen = () => {
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishedYear, setPublishedYear] = useState('');
    const [genre, setGenre] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddBook = async () => {
        if (!validateBookData(title, author, publishedYear, genre)) return;

        const newBook = {
            title,
            author,
            published_year: parseInt(publishedYear, 10),
            genre,
        };

        try {
            setIsSubmitting(true);
            await createBook(newBook, userToken);
            Alert.alert('Success', 'Book added successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add book');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Add New Book</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Author"
                value={author}
                onChangeText={setAuthor}
            />
            <TextInput
                style={styles.input}
                placeholder="Published Year"
                keyboardType="numeric"
                value={publishedYear}
                onChangeText={setPublishedYear}
            />
            <TextInput
                style={styles.input}
                placeholder="Genre"
                value={genre}
                onChangeText={setGenre}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleAddBook}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Add Book</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddBookScreen;
