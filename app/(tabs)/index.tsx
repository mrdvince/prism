import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Paper } from '../models/Paper';
import { paperService } from '../services/paperService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

const getDiscoveryMessage = (paper: Paper) => {
  const messages: Record<number, string> = {
    1: "Discover how attention mechanisms are revolutionizing deep learning",
    2: "Explore the breakthrough that changed NLP forever",
    3: "See how language models are pushing the boundaries of AI"
  };
  return messages[paper.id as number] || "Discover groundbreaking research";
};

const PaperCard = ({ paper, style }: { paper: Paper; style?: any }) => {
  return (
    <Animated.View style={[styles.card, style]}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            {getDiscoveryMessage(paper)}
          </Text>
        </View>
        
        {/* Alternate between different visualization types */}
        <View style={styles.diagramContainer}>
          <View style={styles.placeholderDiagram}>
            {paper.id === 1 ? (
              // Bar chart for first paper
              <View style={styles.dummyBars}>
                <View style={[styles.bar, { height: 60 }]} />
                <View style={[styles.bar, { height: 40 }]} />
                <View style={[styles.bar, { height: 80 }]} />
                <View style={[styles.bar, { height: 30 }]} />
              </View>
            ) : paper.id === 2 ? (
              // Line graph for second paper
              <View style={styles.lineGraph}>
                <View style={styles.line} />
                <View style={[styles.dot, { left: '20%', top: '60%' }]} />
                <View style={[styles.dot, { left: '40%', top: '40%' }]} />
                <View style={[styles.dot, { left: '60%', top: '20%' }]} />
                <View style={[styles.dot, { left: '80%', top: '30%' }]} />
              </View>
            ) : (
              // Scatter plot for third paper
              <View style={styles.scatterPlot}>
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.scatter,
                      {
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.authors}>
          {paper.authors.map(author => author.name).join(', ')}
        </Text>
        <Text style={styles.journalYear}>
          {paper.journal} {paper.year}
        </Text>
        <View style={styles.abstractContainer}>
          <Text style={styles.abstract}>{paper.abstract}</Text>
        </View>
        <View style={styles.metadata}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScrollView}
          >
            <View style={styles.tags}>
              {paper.keywords.map((keyword, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{keyword}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

export default function TabOneScreen() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const response = await paperService.getPapers(1, 10);
      setPapers(response.papers);
    } catch (err) {
      setError('Failed to load papers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => swipeLeft()}
      >
        <FontAwesome name="times" size={24} color="#e74c3c" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => console.log('Bookmark:', papers[currentIndex].title)}
      >
        <FontAwesome name="bookmark" size={24} color="#2f95dc" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => swipeRight()}
      >
        <FontAwesome name="heart" size={24} color="#27ae60" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => console.log('Share:', papers[currentIndex].title)}
      >
        <FontAwesome name="share" size={24} color="#9b59b6" />
      </TouchableOpacity>
    </View>
  );

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
        {renderBottomBar()}
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
    marginTop: 'auto', // Push to bottom of card
  },
  tagsScrollView: {
    flexGrow: 0,
  },
  tags: {
    flexDirection: 'row',
    paddingRight: 16, // Add padding for last tag
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  diagramContainer: {
    height: 200,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    overflow: 'hidden',
  },
  placeholderDiagram: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  dummyChart: {
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  dummyBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  bar: {
    width: 30,
    backgroundColor: '#2f95dc',
    opacity: 0.7,
    borderRadius: 4,
  },
  lineGraph: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  line: {
    height: 2,
    backgroundColor: '#2f95dc',
    position: 'absolute',
    width: '100%',
    top: '50%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2f95dc',
    position: 'absolute',
  },
  scatterPlot: {
    flex: 1,
    position: 'relative',
  },
  scatter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2f95dc',
    position: 'absolute',
    opacity: 0.7,
  },
});
