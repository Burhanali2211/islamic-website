-- Quick fix for RLS policies to allow books to be viewed by everyone
-- and allow admins to manage books

-- ============================================================================
-- FIX BOOKS TABLE POLICIES
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view books" ON books;
DROP POLICY IF EXISTS "Anyone can view books" ON books;
DROP POLICY IF EXISTS "Admins can insert books" ON books;
DROP POLICY IF EXISTS "Admins can update books" ON books;
DROP POLICY IF EXISTS "Admins can delete books" ON books;

-- Allow everyone to view books (no authentication required)
CREATE POLICY "Anyone can view books" ON books
FOR SELECT USING (true);

-- Admins can insert books
CREATE POLICY "Admins can insert books" ON books
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can update books
CREATE POLICY "Admins can update books" ON books
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- Admins can delete books
CREATE POLICY "Admins can delete books" ON books
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- ============================================================================
-- FIX CATEGORIES TABLE POLICIES
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Everyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- Allow everyone to view categories (no authentication required)
CREATE POLICY "Anyone can view categories" ON categories
FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories" ON categories
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

CREATE POLICY "Admins can update categories" ON categories
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

CREATE POLICY "Admins can delete categories" ON categories
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);

-- ============================================================================
-- ADD SOME TEST DATA
-- ============================================================================

-- Insert some test books to verify the system is working
INSERT INTO books (
    title,
    title_arabic,
    author_name,
    author_arabic,
    category,
    description,
    description_arabic,
    language,
    pages,
    is_featured,
    is_available,
    physical_copies,
    rating,
    download_count,
    tags
) VALUES 
(
    'Sahih Al-Bukhari',
    'صحيح البخاري',
    'Imam Muhammad al-Bukhari',
    'الإمام محمد البخاري',
    'hadith',
    'The most authentic collection of Prophetic traditions, compiled by Imam al-Bukhari.',
    'أصح مجموعة من الأحاديث النبوية الشريفة، جمعها الإمام البخاري.',
    'ar',
    2000,
    true,
    true,
    5,
    4.9,
    1250,
    ARRAY['hadith', 'authentic', 'bukhari', 'sunnah']
),
(
    'Tafseer Ibn Kathir',
    'تفسير ابن كثير',
    'Ibn Kathir',
    'ابن كثير',
    'tafsir',
    'A comprehensive commentary on the Holy Quran by the renowned scholar Ibn Kathir.',
    'تفسير شامل للقرآن الكريم من قبل العالم الجليل ابن كثير.',
    'ar',
    3500,
    true,
    true,
    3,
    4.8,
    980,
    ARRAY['tafsir', 'quran', 'commentary', 'ibn kathir']
),
(
    'Riyadh as-Salihin',
    'رياض الصالحين',
    'Imam an-Nawawi',
    'الإمام النووي',
    'hadith',
    'A collection of authentic hadiths compiled by Imam an-Nawawi for spiritual development.',
    'مجموعة من الأحاديث الصحيحة جمعها الإمام النووي للتطوير الروحي.',
    'ar',
    800,
    true,
    true,
    7,
    4.7,
    1500,
    ARRAY['hadith', 'nawawi', 'spiritual', 'development']
)
ON CONFLICT DO NOTHING;

-- Insert some test categories if they don't exist
INSERT INTO categories (name, name_arabic, category_type, sort_order, description) VALUES
('Holy Quran', 'القرآن الكريم', 'quran', 1, 'The Holy Quran and related studies'),
('Hadith', 'الحديث الشريف', 'hadith', 2, 'Prophetic traditions and sayings'),
('Islamic Jurisprudence', 'الفقه', 'fiqh', 3, 'Islamic law and jurisprudence'),
('Quranic Commentary', 'التفسير', 'tafsir', 4, 'Commentary and interpretation of the Quran'),
('Islamic Creed', 'العقيدة', 'aqeedah', 5, 'Islamic beliefs and theology'),
('Prophetic Biography', 'السيرة النبوية', 'seerah', 6, 'Life and biography of Prophet Muhammad'),
('Islamic History', 'التاريخ الإسلامي', 'history', 7, 'History of Islam and Muslims')
ON CONFLICT (name) DO NOTHING;
