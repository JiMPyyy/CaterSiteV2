'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SamplerSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeSelect: (size: 'small' | 'large') => void;
}

export default function SamplerSizeModal({ isOpen, onClose, onSizeSelect }: SamplerSizeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl"
        style={{ color: 'rgb(15, 15, 15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Sampler Plate</h2>
            <p className="text-gray-600 mt-1">Choose your size</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Size Selection */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Small Sampler */}
            <button
              onClick={() => onSizeSelect('small')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Small Sampler</h3>
                <p className="text-gray-600 mb-4 flex-grow">Choose 3 sandwiches</p>
                <div className="text-2xl font-bold text-green-600">$73.99</div>
              </div>
            </button>

            {/* Large Sampler */}
            <button
              onClick={() => onSizeSelect('large')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Large Sampler</h3>
                <p className="text-gray-600 mb-4 flex-grow">Choose 4 sandwiches</p>
                <div className="text-2xl font-bold text-green-600">$97.99</div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
