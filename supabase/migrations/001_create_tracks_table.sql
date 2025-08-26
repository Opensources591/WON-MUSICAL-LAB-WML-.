-- Create tracks table for WON MUSICALS
CREATE TABLE IF NOT EXISTS won_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  style VARCHAR(50) NOT NULL,
  language VARCHAR(20) NOT NULL DEFAULT 'english',
  audio_url TEXT,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('won-musicals-audio', 'won-musicals-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE won_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all tracks" ON won_tracks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own tracks" ON won_tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Storage policies
CREATE POLICY "Anyone can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'won-musicals-audio');

CREATE POLICY "Authenticated users can upload audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'won-musicals-audio');
