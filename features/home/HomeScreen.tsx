import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleCategoryPress = (category: string) => {
    router.push(`/${category}` as any);
  };

  const categories = [
    { id: 'laptop', name: 'Laptops', icon: '💻' },
    { id: 'phone', name: 'Phones', icon: '📱' },
    { id: 'tablet', name: 'Tablets', icon: '📱' },
    { id: 'pc', name: 'PCs', icon: '🖥️' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'camera', name: 'Cameras', icon: '📷' },
    { id: 'drone', name: 'Drones', icon: '🚁' },
    { id: 'audio', name: 'Audio', icon: '🎧' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Hirayo</Text>
        <Text style={styles.subtitle}>Rent the tech you need</Text>
      </View>

      <View style={styles.searchSection}>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchText}>🔍 Search for items...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.featuredCard}>
            <View style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>MacBook Pro 16"</Text>
            <Text style={styles.featuredPrice}>₱3,500 for a day</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featuredCard}>
            <View style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>iPhone 15 Pro</Text>
            <Text style={styles.featuredPrice}>₱1,800 for a day</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featuredCard}>
            <View style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>Sony A7R V</Text>
            <Text style={styles.featuredPrice}>₱2,500 for a day</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
  },
  title: {
    ...TextStyles.display.small,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.body.large,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  searchSection: {
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  searchBar: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  searchText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  categoriesSection: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredSection: {
    padding: Spacing.xl,
    paddingTop: 0,
  },
  featuredCard: {
    width: 200,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  featuredImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  featuredTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  featuredPrice: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    fontWeight: '600',
  },
});
