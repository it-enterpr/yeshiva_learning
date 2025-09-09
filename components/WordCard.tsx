import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RotateCcw, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface WordCardProps {
  word: string;
  translation: string;
  gematria: {
    simple: number;
    standard: number;
    ordinal: number;
  };
  onKnown: () => void;
  onUnknown: () => void;
}

export default function WordCard({ word, translation, gematria, onKnown, onUnknown }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGematria, setShowGematria] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleGematria = () => {
    setShowGematria(!showGematria);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleFlip}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {!isFlipped ? (
            // Hebrew word side
            <View style={styles.frontSide}>
              <Text style={styles.hebrewWord}>{word}</Text>
              <Text style={styles.tapHint}>Tap to reveal translation</Text>
            </View>
          ) : (
            // Translation side
            <View style={styles.backSide}>
              <Text style={styles.hebrewWordSmall}>{word}</Text>
              <Text style={styles.translation}>{translation}</Text>
              
              <TouchableOpacity 
                style={styles.gematriaButton}
                onPress={toggleGematria}
              >
                <RotateCcw size={16} color="#3b82f6" />
                <Text style={styles.gematriaButtonText}>
                  {showGematria ? 'Hide' : 'Show'} Gematria
                </Text>
              </TouchableOpacity>

              {showGematria && (
                <View style={styles.gematriaContainer}>
                  <Text style={styles.gematriaTitle}>Gematria Values:</Text>
                  <Text style={styles.gematriaValue}>Simple: {gematria.simple}</Text>
                  <Text style={styles.gematriaValue}>Standard: {gematria.standard}</Text>
                  <Text style={styles.gematriaValue}>Ordinal: {gematria.ordinal}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {isFlipped && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.unknownButton]}
            onPress={onUnknown}
          >
            <XCircle size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Don't Know</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.knownButton]}
            onPress={onKnown}
          >
            <CheckCircle size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>I Know This</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  frontSide: {
    alignItems: 'center',
  },
  backSide: {
    alignItems: 'center',
    width: '100%',
  },
  hebrewWord: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 16,
    direction: 'rtl',
  },
  hebrewWordSmall: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 12,
    direction: 'rtl',
  },
  translation: {
    fontSize: 20,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  tapHint: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gematriaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    gap: 6,
    marginBottom: 16,
  },
  gematriaButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  gematriaContainer: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  gematriaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  gematriaValue: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  unknownButton: {
    backgroundColor: '#ef4444',
  },
  knownButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});