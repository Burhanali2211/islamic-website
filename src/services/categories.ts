import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type IslamicCategory = Database['public']['Tables']['islamic_categories']['Row'];
type CategoryInsert = Database['public']['Tables']['islamic_categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['islamic_categories']['Update'];

export interface CategoryResponse {
  data: IslamicCategory[] | IslamicCategory | null;
  error: string | null;
  count?: number;
}

class CategoriesService {
  // Get all Islamic categories (Tasnifat Islamiyya - تصنيفات إسلامية)
  async getCategories(): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get categories by type
  async getCategoriesByType(categoryType: string): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .select('*')
        .eq('category_type', categoryType)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create new category
  async createCategory(categoryData: CategoryInsert): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .insert({
          ...categoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update category
  async updateCategory(id: string, updates: CategoryUpdate): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('islamic_categories')
        .delete()
        .eq('id', id);

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Get hierarchical categories (parent-child structure)
  async getHierarchicalCategories(): Promise<CategoryResponse> {
    try {
      const { data: allCategories, error } = await supabase
        .from('islamic_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      // Organize into hierarchical structure
      const parentCategories = allCategories.filter(cat => !cat.parent_category_id);
      const childCategories = allCategories.filter(cat => cat.parent_category_id);

      const hierarchical = parentCategories.map(parent => ({
        ...parent,
        children: childCategories.filter(child => child.parent_category_id === parent.id)
      }));

      return { data: hierarchical, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get default Islamic categories for initial setup
  getDefaultCategories(): CategoryInsert[] {
    return [
      {
        name: 'Quran Studies',
        name_arabic: 'علوم القرآن',
        description: 'Studies related to the Holy Quran including recitation, memorization, and sciences',
        description_arabic: 'الدراسات المتعلقة بالقرآن الكريم بما في ذلك التلاوة والحفظ والعلوم',
        category_type: 'quran',
        display_order: 1
      },
      {
        name: 'Hadith Sciences',
        name_arabic: 'علوم الحديث',
        description: 'Sciences related to Prophetic traditions and their authentication',
        description_arabic: 'العلوم المتعلقة بالأحاديث النبوية وتوثيقها',
        category_type: 'hadith',
        display_order: 2
      },
      {
        name: 'Islamic Jurisprudence',
        name_arabic: 'الفقه الإسلامي',
        description: 'Islamic law and jurisprudence covering all aspects of Muslim life',
        description_arabic: 'الفقه الإسلامي والقانون الإسلامي الذي يغطي جميع جوانب حياة المسلم',
        category_type: 'fiqh',
        display_order: 3
      },
      {
        name: 'Quranic Commentary',
        name_arabic: 'التفسير',
        description: 'Interpretation and commentary of the Holy Quran',
        description_arabic: 'تفسير وشرح القرآن الكريم',
        category_type: 'tafsir',
        display_order: 4
      },
      {
        name: 'Islamic History',
        name_arabic: 'التاريخ الإسلامي',
        description: 'History of Islam, Islamic civilization, and Muslim nations',
        description_arabic: 'تاريخ الإسلام والحضارة الإسلامية والأمم الإسلامية',
        category_type: 'history',
        display_order: 5
      },
      {
        name: 'Prophetic Biography',
        name_arabic: 'السيرة النبوية',
        description: 'Biography of Prophet Muhammad (PBUH) and his companions',
        description_arabic: 'سيرة النبي محمد صلى الله عليه وسلم وصحابته الكرام',
        category_type: 'biography',
        display_order: 6
      },
      {
        name: 'Islamic Creed',
        name_arabic: 'العقيدة الإسلامية',
        description: 'Islamic beliefs, theology, and matters of faith',
        description_arabic: 'العقائد الإسلامية واللاهوت وأمور الإيمان',
        category_type: 'aqeedah',
        display_order: 7
      },
      {
        name: 'Islamic Supplications',
        name_arabic: 'الأدعية الإسلامية',
        description: 'Authentic Islamic prayers, supplications, and remembrance',
        description_arabic: 'الأدعية والأذكار الإسلامية الصحيحة',
        category_type: 'dua',
        display_order: 8
      },
      {
        name: 'Islamic Law',
        name_arabic: 'الشريعة الإسلامية',
        description: 'Islamic legal system, principles, and applications',
        description_arabic: 'النظام القانوني الإسلامي ومبادئه وتطبيقاته',
        category_type: 'islamic_law',
        display_order: 9
      }
    ];
  }

  // Initialize default categories
  async initializeDefaultCategories(): Promise<{ success: number; errors: string[] }> {
    const defaultCategories = this.getDefaultCategories();
    const results = { success: 0, errors: [] as string[] };

    for (const category of defaultCategories) {
      const { error } = await this.createCategory(category);
      if (error) {
        results.errors.push(`Failed to create category ${category.name}: ${error}`);
      } else {
        results.success++;
      }
    }

    return results;
  }

  // Get category statistics
  async getCategoryStatistics(): Promise<{
    totalCategories: number;
    byType: Record<string, number>;
    activeCategories: number;
    error: string | null;
  }> {
    try {
      const { data: categories, error } = await supabase
        .from('islamic_categories')
        .select('category_type, is_active');

      if (error) {
        return {
          totalCategories: 0,
          byType: {},
          activeCategories: 0,
          error: error.message
        };
      }

      const stats = {
        totalCategories: categories.length,
        byType: {} as Record<string, number>,
        activeCategories: categories.filter(c => c.is_active).length,
        error: null
      };

      // Count by type
      categories.forEach(category => {
        stats.byType[category.category_type] = (stats.byType[category.category_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      return {
        totalCategories: 0,
        byType: {},
        activeCategories: 0,
        error: (error as Error).message
      };
    }
  }

  // Search categories
  async searchCategories(query: string): Promise<CategoryResponse> {
    try {
      const { data, error } = await supabase
        .from('islamic_categories')
        .select('*')
        .or(`name.ilike.%${query}%,name_arabic.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Toggle category status
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<CategoryResponse> {
    return this.updateCategory(id, { is_active: isActive });
  }

  // Reorder categories
  async reorderCategories(categoryOrders: { id: string; displayOrder: number }[]): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };

    for (const { id, displayOrder } of categoryOrders) {
      const { error } = await this.updateCategory(id, { display_order: displayOrder });
      if (error) {
        results.errors.push(`Failed to reorder category ${id}: ${error}`);
      } else {
        results.success++;
      }
    }

    return results;
  }
}

export const categoriesService = new CategoriesService();

// Export types for use in other files
export type { IslamicCategory, CategoryInsert, CategoryUpdate, CategoryResponse };
