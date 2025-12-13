import { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, X, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function CreatePage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user || !profile) return;

    setIsUploading(true);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(selectedFile);

      // Save to Firestore
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        username: profile.username,
        avatar: profile.avatarUrl,
        caption,
        media: [{
          mediaUrl: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          type: uploadResult.resource_type,
        }],
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });

      // Update user's post count
      await updateDoc(doc(db, 'users', user.uid), {
        postsCount: increment(1),
      });

      toast({ title: 'Post created successfully!' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create Post</h1>
          <Button
            variant="premium"
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Posting...' : 'Share'}
          </Button>
        </header>

        {/* Upload Area */}
        {!previewUrl ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => fileInputRef.current?.click()}
            className="elevated-card flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-2xl"
          >
            <div className="rounded-full bg-secondary p-6">
              <Image className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">Add Photos or Videos</p>
              <p className="text-sm text-muted-foreground">
                Tap to select from your device
              </p>
            </div>
          </motion.button>
        ) : (
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={previewUrl}
              alt="Preview"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveFile}
              className="absolute right-3 top-3 rounded-full bg-foreground/80 p-2 text-background backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        )}

        {/* Caption */}
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <img
                src={profile?.avatarUrl}
                alt={profile?.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="flex-1 resize-none bg-transparent text-sm focus:outline-none"
                rows={3}
              />
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <button className="flex w-full items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Add location</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </motion.div>
    </MainLayout>
  );
}
