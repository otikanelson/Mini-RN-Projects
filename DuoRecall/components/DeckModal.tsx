import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
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
  onDeleteDeck,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.centeredView}
        onPress={onClose}
      >
        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
          <Pressable 
            style={({ pressed }) => [
              styles.closeButtonIcon,
              pressed && styles.closeButtonPressed
            ]}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={32} color="#AFAFAF" />
          </Pressable>
          
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={32} color="#1CB0F6" />
            </View>
            <Text style={styles.modalTitle}>{deckTitle}</Text>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.optionButton,
              styles.editButton,
              pressed && styles.optionButtonPressed
            ]}
            onPress={onEditDeck}
          >
            <Ionicons name="create" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit Cards</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.optionButton,
              styles.quizButton,
              pressed && styles.optionButtonPressed
            ]}
            onPress={onTakeQuiz}
          >
            <Ionicons name="play-circle" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start Quiz</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.optionButton,
              styles.deleteButton,
              pressed && styles.optionButtonPressed
            ]}
            onPress={onDeleteDeck}
          >
            <Ionicons name="trash" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Delete Deck</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: Platform.OS == "web" ? "40%" : "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "stretch",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
  closeButtonIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  closeButtonPressed: {
    opacity: 0.6,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "FeatherBold",
    color: "#3C3C3C",
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.1)",
  },
  optionButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  editButton: {
    backgroundColor: "#1CB0F6",
  },
  quizButton: {
    backgroundColor: "#58CC02",
  },
  deleteButton: {
    backgroundColor: "#FF4B4B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "FeatherBold",
    fontSize: 17,
  },
});

export default DeckModal;
