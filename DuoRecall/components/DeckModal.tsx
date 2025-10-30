import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeckModalProps {
  isVisible: boolean;
  deckTitle: string;
  onClose: () => void;
  onEditDeck: () => void;
  onTakeQuiz: () => void;
  onDeleteDeck: () => void;
}

const DeckModal: React.FC<DeckModalProps> = ({
  isVisible,
  deckTitle,
  onClose,
  onEditDeck,
  onTakeQuiz,
  onDeleteDeck, // Destructured the new prop
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.centeredView}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButtonIcon} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#888" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{deckTitle}</Text>
          {/* Edit Deck Button */}
          <TouchableOpacity style={styles.optionButton} onPress={onEditDeck}>
            <Text style={styles.buttonText}>Edit Deck Content</Text>
          </TouchableOpacity>
          {/* Take Quiz Button */}
          <TouchableOpacity style={styles.optionButton} onPress={onTakeQuiz}>
            <Text style={styles.buttonText}>Take Quiz</Text>
          </TouchableOpacity>
          {/* Delete Deck Button */}
          <TouchableOpacity
            style={[styles.optionButton, styles.deleteButton]}
            onPress={onDeleteDeck}
          >
            <Text style={styles.buttonText}>Delete Deck</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    width: Platform.OS == "web" ? "40%" : "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "FeatherBold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ce0909ff",
  },
  closeButton: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "FeatherBold",
    fontSize: 16,
  },
  closeButtonIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});

export default DeckModal;
