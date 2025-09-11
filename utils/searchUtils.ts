export interface SearchableItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  location?: string;
  price?: number;
  rating?: number;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
}

export function searchItems<T extends SearchableItem>(
  items: T[],
  query: string,
  filters?: SearchFilters
): T[] {
  if (!query.trim() && !filters) {
    return items;
  }

  let filteredItems = [...items];

  // Apply text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    filteredItems = filteredItems.filter(item => {
      const searchableText = [
        item.name,
        item.category,
        item.description,
        item.location
      ].filter(Boolean).join(' ').toLowerCase();

      return searchTerms.every(term => 
        searchableText.includes(term)
      );
    });
  }

  // Apply filters
  if (filters) {
    if (filters.category) {
      filteredItems = filteredItems.filter(item => 
        item.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.location) {
      filteredItems = filteredItems.filter(item => 
        item.location?.toLowerCase().includes(filters.location?.toLowerCase() || '')
      );
    }

    if (filters.priceRange) {
      filteredItems = filteredItems.filter(item => 
        item.price && 
        item.price >= filters.priceRange!.min && 
        item.price <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      filteredItems = filteredItems.filter(item => 
        item.rating && item.rating >= filters.rating!
      );
    }
  }

  return filteredItems;
}

export function getSearchSuggestions(
  items: SearchableItem[],
  query: string,
  maxSuggestions: number = 5
): string[] {
  if (!query.trim()) {
    return [];
  }

  const suggestions = new Set<string>();
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  const lastTerm = searchTerms[searchTerms.length - 1];

  items.forEach(item => {
    const searchableText = [
      item.name,
      item.category,
      item.description,
      item.location
    ].filter(Boolean).join(' ').toLowerCase();

    // Extract words that start with the last search term
    const words = searchableText.split(/\s+/);
    words.forEach(word => {
      if (word.startsWith(lastTerm) && word.length > lastTerm.length) {
        suggestions.add(word);
      }
    });
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
