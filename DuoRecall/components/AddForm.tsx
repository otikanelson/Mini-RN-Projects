import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


interface CardFormProps {
    onAddDeck: (title: string, description: string) => void;
    onClose: () => void;
}

const AddForm: React.FC<CardFormProps> = ({ onAddDeck, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (title.trim() && description.trim()) {
            onAddDeck(title, description);
            onClose(); 
        } else {
            alert("Please enter both title and description.");
        }
    };

    return (
        <View style={formStyles.overlay}>
            <View style={formStyles.formContainer}>
                <Text style={formStyles.formTitle}>Add New Deck</Text>
                
                <TextInput
                    style={formStyles.input}
                    placeholder="Title (e.g., French Vocab)"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={formStyles.input}
                    placeholder="Description (e.g., 50 common phrases)"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <View style={formStyles.buttonRow}>
                    <TouchableOpacity style={formStyles.cancelButton} onPress={onClose}>
                        <Text style={formStyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={formStyles.addButton} onPress={handleSubmit}>
                        <Text style={formStyles.buttonText}>Add Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const formStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: Platform.OS == "web" ? '50%' : '85%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    formTitle: {
        fontSize: 18,
        fontFamily: "FeatherBold",
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: '#1e90ff',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: "FeatherBold",
    },
});

export default AddForm;