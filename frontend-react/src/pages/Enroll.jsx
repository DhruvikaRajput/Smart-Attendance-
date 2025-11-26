import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from '../components/Card';
import WebcamCapture from '../components/WebcamCapture';
import { enrollStudent } from '../api/api';
import { useToast } from '../components/Toast';

export default function Enroll() {
  const [name, setName] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCapture = (imageData) => {
    if (capturedImages.length >= 5) {
      showToast('You have already captured 5 images', 'warning');
      return;
    }
    setCapturedImages([...capturedImages, imageData]);
    showToast(`Image ${capturedImages.length + 1} captured!`, 'success');
  };

  const removeImage = (index) => {
    setCapturedImages(capturedImages.filter((_, i) => index !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (capturedImages.length !== 5) {
      showToast('Please capture all 5 images', 'error');
      return;
    }
    if (!name.trim()) {
      showToast('Please enter student name', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await enrollStudent(name.trim(), capturedImages);
      showToast(`Student ${result.name} (Roll: ${result.roll}) enrolled successfully!`, 'success');
      setName('');
      setCapturedImages([]);
    } catch (error) {
      console.error('Enrollment error:', error);
      showToast(error.response?.data?.detail || 'Failed to enroll student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const progress = (capturedImages.length / 5) * 100;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Enroll New Student</h1>
        <p className="text-text-secondary">Capture 5 clear images of the student's face</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Webcam Section */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Capture Face Images</h3>
            <p className="text-sm text-text-secondary">Capture 5 clear images of the student's face</p>
          </div>
          <WebcamCapture onCapture={handleCapture} disabled={capturedImages.length >= 5} />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                Progress: {capturedImages.length} / 5 images captured
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </Card>

        {/* Form Section */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Student Information</h3>
            <p className="text-sm text-text-secondary">Enter student details</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter student's full name"
                required
              />
            </div>

            {/* Thumbnails */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Captured Images</label>
              <div className="grid grid-cols-5 gap-3">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-button overflow-hidden border-2 border-border bg-background relative"
                  >
                    {capturedImages[index] ? (
                      <>
                        <img src={capturedImages[index]} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute bottom-1 left-1 right-1 btn btn-danger text-xs py-1"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-tertiary text-sm">
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || capturedImages.length !== 5}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enrolling...
                </>
              ) : (
                'Enroll Student'
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

