-- Quick setup script to create the essential tables for the Islamic library
-- This creates the minimum required tables to fix the "islamic_categories" error

-- Create the categories table (this is what the code expects)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    name_arabic TEXT,
    description TEXT,
    description_arabic TEXT,
    parent_id UUID REFERENCES categories(id),
    category_type TEXT NOT NULL CHECK (category_type IN (
        'quran', 'hadith', 'fiqh', 'tafsir', 'aqeedah', 'seerah', 
        'history', 'biography', 'dua', 'islamic_law', 'arabic_language', 
        'islamic_ethics', 'comparative_religion', 'islamic_philosophy', 
        'sufism', 'general'
    )),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert basic Islamic categories
INSERT INTO categories (name, name_arabic, category_type, sort_order, description) VALUES
('Holy Quran', 'القرآن الكريم', 'quran', 1, 'The Holy Quran and related studies'),
('Hadith', 'الحديث الشريف', 'hadith', 2, 'Prophetic traditions and sayings'),
('Islamic Jurisprudence', 'الفقه', 'fiqh', 3, 'Islamic law and jurisprudence'),
('Quranic Commentary', 'التفسير', 'tafsir', 4, 'Commentary and interpretation of the Quran'),
('Islamic Creed', 'العقيدة', 'aqeedah', 5, 'Islamic beliefs and theology'),
('Prophetic Biography', 'السيرة النبوية', 'seerah', 6, 'Life and biography of Prophet Muhammad'),
('Islamic History', 'التاريخ الإسلامي', 'history', 7, 'History of Islam and Muslims'),
('Biographies', 'التراجم', 'biography', 8, 'Biographies of Islamic scholars and personalities'),
('Supplications', 'الأدعية', 'dua', 9, 'Islamic prayers and supplications'),
('Islamic Law', 'الشريعة الإسلامية', 'islamic_law', 10, 'Islamic legal system and principles'),
('Arabic Language', 'اللغة العربية', 'arabic_language', 11, 'Arabic language studies'),
('Islamic Ethics', 'الأخلاق الإسلامية', 'islamic_ethics', 12, 'Islamic morals and character'),
('Comparative Religion', 'مقارنة الأديان', 'comparative_religion', 13, 'Study of different religions'),
('Islamic Philosophy', 'الفلسفة الإسلامية', 'islamic_philosophy', 14, 'Islamic philosophical thought'),
('Sufism', 'التصوف', 'sufism', 15, 'Islamic mysticism and spirituality'),
('General', 'عام', 'general', 16, 'General Islamic studies')
ON CONFLICT (name) DO NOTHING;

-- Update the books table to match the new schema (if it exists)
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Check if books table exists and add missing columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'books') THEN
        -- Add author_name column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'author_name') THEN
            ALTER TABLE books ADD COLUMN author_name TEXT;
            -- Copy data from author column if it exists
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'author') THEN
                UPDATE books SET author_name = author WHERE author_name IS NULL;
            END IF;
        END IF;
        
        -- Add publisher_name column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'publisher_name') THEN
            ALTER TABLE books ADD COLUMN publisher_name TEXT;
            -- Copy data from publisher column if it exists
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'publisher') THEN
                UPDATE books SET publisher_name = publisher WHERE publisher_name IS NULL;
            END IF;
        END IF;
        
        -- Add other missing columns
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'subtitle') THEN
            ALTER TABLE books ADD COLUMN subtitle TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'subtitle_arabic') THEN
            ALTER TABLE books ADD COLUMN subtitle_arabic TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'author_id') THEN
            ALTER TABLE books ADD COLUMN author_id UUID;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'publisher_id') THEN
            ALTER TABLE books ADD COLUMN publisher_id UUID;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'category_id') THEN
            ALTER TABLE books ADD COLUMN category_id UUID REFERENCES categories(id);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'edition') THEN
            ALTER TABLE books ADD COLUMN edition INTEGER DEFAULT 1;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'file_size_mb') THEN
            ALTER TABLE books ADD COLUMN file_size_mb DECIMAL(10,2);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'available_copies') THEN
            ALTER TABLE books ADD COLUMN available_copies INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'location_shelf') THEN
            ALTER TABLE books ADD COLUMN location_shelf TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'location_section') THEN
            ALTER TABLE books ADD COLUMN location_section TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'borrow_count') THEN
            ALTER TABLE books ADD COLUMN borrow_count INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'is_recommended') THEN
            ALTER TABLE books ADD COLUMN is_recommended BOOLEAN DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'age_restriction') THEN
            ALTER TABLE books ADD COLUMN age_restriction INTEGER;
        END IF;
    END IF;
END $$;

-- Enable Row Level Security on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories table
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert categories" ON categories FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update categories" ON categories FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete categories" ON categories FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
