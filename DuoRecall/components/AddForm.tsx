import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        <Pressable style={formStyles.overlay} onPress={onClose}>
            <Pressable style={formStyles.formContainer} onPress={(e) => e.stopPropagation()}>
                <View style={formStyles.headerContainer}>
                    <View style={formStyles.iconContainer}>
                        <Ionicons name="add-circle" size={40} color="#58CC02" />
                    </View>
                    <Text style={formStyles.formTitle}>Create New Deck</Text>
                    <Text style={formStyles.formSubtitle}>Start your learning journey</Text>
                </View>
                
                <View style={formStyles.inputGroup}>
                    <View style={formStyles.labelContainer}>
                        <Ionicons name="book" size={18} color="#1CB0F6" />
                        <Text style={formStyles.label}>Deck Title</Text>
                    </View>
                    <TextInput
                        style={formStyles.input}
                        placeholder="e.g., Spanish Basics"
                        placeholderTextColor="#AFAFAF"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={formStyles.inputGroup}>
                    <View style={formStyles.labelContainer}>
                        <Ionicons name="document-text" size={18} color="#58CC02" />
                        <Text style={formStyles.label}>Description</Text>
                    </View>
                    <TextInput
                        style={[formStyles.input, formStyles.textArea]}
                        placeholder="e.g., Common phrases and vocabulary"
                        placeholderTextColor="#AFAFAF"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={formStyles.buttonRow}>
                    <Pressable 
                        style={({ pressed }) => [
                            formStyles.button,
                            formStyles.cancelButton,
                            pressed && formStyles.buttonPressed
                        ]}
                        onPress={onClose}
                    >
                        <Text style={formStyles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable 
                        style={({ pressed }) => [
                            formStyles.button,
                            formStyles.addButton,
                            pressed && formStyles.buttonPressed
                        ]}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                        <Text style={formStyles.addButtonText}>Create Deck</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Pressable>
    );
};

const formStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: Platform.OS == "web" ? '50%' : '90%',
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: '#E5E5E5',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        marginBottom: 12,
    },
    formTitle: {
        fontSize: 24,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
        fontFamily: "FeatherBold",
        color: '#AFAFAF',
    },
    inputGroup: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        padding: 14,
        fontSize: 16,
        fontFamily: "FeatherBold",
        color: '#3C3C3C',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    buttonPressed: {
        transform: [{ translateY: 2 }],
        borderBottomWidth: 2,
    },
    cancelButton: {
        backgroundColor: '#E5E5E5',
    },
    addButton: {
        backgroundColor: '#58CC02',
    },
    cancelButtonText: {
        color: '#3C3C3C',
        fontFamily: "FeatherBold",
        fontSize: 16,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontFamily: "FeatherBold",
        fontSize: 16,
    },
});

export default AddForm;
