import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Paper {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  year: number;
  keywords: string[];
}

const PaperCard = ({ paper }: { paper: Paper }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{paper.title}</Text>
      <Text style={styles.authors}>{paper.authors.join(', ')}</Text>
      <View style={styles.abstractContainer}>
        <Text style={styles.abstract}>{paper.abstract}</Text>
      </View>
      <View style={styles.metadata}>
        <Text style={styles.journal}>{paper.journal}</Text>
        <Text style={styles.year}>{paper.year}</Text>
        <View style={styles.tags}>
          {paper.keywords.map((keyword, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function TabOneScreen() {
  const [papers] = useState<Paper[]>([
    {
      id: 1,
      title: "Deep Learning Approaches in Medical Image Analysis",
      authors: ["John Doe", "Jane Smith"],
      abstract: "This paper explores the applications of deep learning in medical image analysis, focusing on recent advancements in CNN architectures for disease detection and classification.",
      journal: "Nature Medicine",
      year: 2023,
      keywords: ["Deep Learning", "Medical Imaging", "AI"]
    },
    {
      id: 2,
      title: "Quantum Computing: A New Era in Computational Science",
      authors: ["Alice Johnson", "Bob Wilson"],
      abstract: "This comprehensive review discusses the current state of quantum computing and its potential implications for computational science.",
      journal: "Science",
      year: 2023,
      keywords: ["Quantum Computing", "Computer Science", "Physics"]
    },
    {
      id: 3,
      title: "Climate Change Impact on Marine Ecosystems",
      authors: ["Maria Garcia", "Peter Chen"],
      abstract: "A detailed analysis of how climate change affects marine biodiversity and ecosystem stability.",
      journal: "Nature Climate Change",
      year: 2023,
      keywords: ["Climate Change", "Marine Biology", "Ecology"]
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(papers.length - 1);

  const handleLike = () => {
    console.log('Liked paper:', papers[currentIndex].title);
    setCurrentIndex(currentIndex - 1);
  };

  const handleDislike = () => {
    console.log('Disliked paper:', papers[currentIndex].title);
    setCurrentIndex(currentIndex - 1);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.cardContainer}>
        {papers.map((paper, index) => (
          index === currentIndex && (
            <PaperCard key={paper.id} paper={paper} />
          )
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]} 
          onPress={handleDislike}
        >
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.likeButton]} 
          onPress={handleLike}
        >
          <Text style={styles.buttonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.2,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authors: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  abstractContainer: {
    flex: 1,
    marginBottom: 15,
  },
  abstract: {
    fontSize: 16,
    lineHeight: 24,
  },
  metadata: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  journal: {
    color: '#666',
    marginBottom: 5,
  },
  year: {
    color: '#666',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  likeButton: {
    backgroundColor: '#27ae60',
  },
  dislikeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});
