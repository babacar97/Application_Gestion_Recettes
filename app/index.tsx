import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';




const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  // Fonction pour charger les recettes depuis AsyncStorage
  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setRecipes(parsedRecipes);
    } catch (error) {
      console.log('Erreur lors de la récupération des recettes :', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [])
  );
  // Utiliser useEffect pour charger les recettes au démarrage
  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSearch = () => {
    console.log('Recherche de:', search);
  };

  const renderRecipe = ({ item }: { item: { id: string; title: string; category: string } }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => router.push(`/recipe/${item.id}`)}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'application de Recettes de Cuisine</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher une recette..."
        value={search}
        onChangeText={setSearch}
      />
      <Button title="Rechercher" onPress={handleSearch} />

      <Text style={styles.subtitle}>Recettes Populaires</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button
        title="Ajouter une nouvelle recette"
        onPress={() => router.push('/add-recipe')}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#666',
  },
});
