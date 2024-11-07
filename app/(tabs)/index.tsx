import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

interface Paper {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  year: number;
  keywords: string[];
  citations?: number;
}

const PaperCard = ({ paper, style }: { paper: Paper; style?: any }) => {
  return (
    <Animated.View style={[styles.card, style]}>
      <View style={styles.cardContent}>
        <View style={styles.citationCount}>
          <Text style={styles.citationText}>↗ {paper.citations || '52,000'}</Text>
        </View>
        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.authors}>{paper.authors.join(', ')}</Text>
        <Text style={styles.journalYear}>
          {paper.journal} {paper.year}
        </Text>
        <View style={styles.abstractContainer}>
          <Text style={styles.abstract}>{paper.abstract}</Text>
        </View>
        <View style={styles.metadata}>
          <View style={styles.tags}>
            {paper.keywords.map((keyword, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function TabOneScreen() {
  const [papers] = useState<Paper[]>([
    {
      id: 1,
      title: "Attention Is All You Need",
      authors: ["Vaswani et al."],
      abstract: "We propose a new network architecture based solely on attention mechanisms. Experiments show these models to be superior in quality while being more parallelizable and requiring significantly less time to train...",
      journal: "NeurIPS",
      year: 2017,
      keywords: ["Deep Learning", "Attention", "Transformers"],
      citations: 52000
    },
    {
      id: 2,
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: ["Devlin et al."],
      abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...",
      journal: "NAACL",
      year: 2019,
      keywords: ["NLP", "Transformers", "Pre-training"],
      citations: 48000
    },
    {
      id: 3,
      title: "GPT-3: Language Models are Few-Shot Learners",
      authors: ["Brown et al."],
      abstract: "We demonstrate that scaling language models greatly improves task-agnostic, few-shot performance...",
      journal: "NeurIPS",
      year: 2020,
      keywords: ["Language Models", "Few-shot Learning", "AI"],
      citations: 25000
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    }
  });

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => nextCard('right'));
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => nextCard('left'));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const nextCard = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on:`, papers[currentIndex].title);
    setCurrentIndex(prevIndex => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  const insets = useSafeAreaInsets();

  if (currentIndex >= papers.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMoreCards}>No more papers!</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[
          styles.cardContainer,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 70,
            height: SCREEN_HEIGHT - insets.top - insets.bottom - 70,
          }
        ]}>
          {papers.map((paper, index) => {
            if (index < currentIndex) return null;
            if (index === currentIndex) {
              return (
                <Animated.View
                  key={paper.id}
                  style={[getCardStyle(), styles.cardWrapper]}
                  {...panResponder.panHandlers}
                >
                  <PaperCard paper={paper} />
                </Animated.View>
              );
            }
            return (
              <View key={paper.id} style={[styles.cardWrapper, { top: 10 }]}>
                <PaperCard paper={paper} />
              </View>
            );
          }).reverse()}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    position: 'absolute',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: 24,
  },
  citationCount: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(47, 149, 220, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  citationText: {
    fontSize: 16,
    color: '#2f95dc',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    marginRight: 80,
    lineHeight: 34,
  },
  authors: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  journalYear: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  abstractContainer: {
    flex: 1,
    marginBottom: 20,
  },
  abstract: {
    fontSize: 17,
    lineHeight: 26,
    color: '#333',
  },
  metadata: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  noMoreCards: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginTop: '50%',
  },
});
