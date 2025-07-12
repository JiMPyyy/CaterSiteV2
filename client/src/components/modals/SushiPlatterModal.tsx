'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { availableSushiItems, availableNigiriOptions, availableSashimiOptions } from '@/data/sushi';
import SushiAdditionsModal from './SushiAdditionsModal';
import { SushiItem } from '@/types/menu';

interface SushiPlatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatter: any;
  onAddToCart: (item: any) => void;
}

export default function SushiPlatterModal({ isOpen, onClose, selectedPlatter, onAddToCart }: SushiPlatterModalProps) {
  const [selectedPlatterSize, setSelectedPlatterSize] = useState<any>(null);
  const [platterSelections, setPlatterSelections] = useState<any[]>([]);
  const [showAdditionsModal, setShowAdditionsModal] = useState(false);
  const [selectedItemForAdditions, setSelectedItemForAdditions] = useState<any>(null);
  const [itemAdditions, setItemAdditions] = useState<{ [itemId: string]: { item: SushiItem; quantity: number }[] }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal to close (but not when additions modal is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if additions modal is open
      if (showAdditionsModal) return;

      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, showAdditionsModal]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPlatterSize(null);
      setPlatterSelections([]);
      setItemAdditions({});
      setSelectedItemForAdditions(null);
      setShowAdditionsModal(false);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when required items are selected
  useEffect(() => {
    if (isOpen && selectedPlatter && selectedPlatterSize && platterSelections.length === selectedPlatterSize.platters?.itemCount) {
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollTo({
            top: modalRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [isOpen, selectedPlatter, platterSelections.length, selectedPlatterSize]);

  // Auto-scroll to bottom when selection is complete
  useEffect(() => {
    if (isOpen && selectedPlatter && selectedPlatterSize) {
      const maxItems = selectedPlatterSize?.platters?.itemCount || 0;
      const isComplete = platterSelections.length === maxItems;

      if (isComplete && modalRef.current) {
        modalRef.current.scrollTo({
          top: modalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, selectedPlatter, selectedPlatterSize, platterSelections]);

  const handleSizeSelection = (size: any) => {
    setSelectedPlatterSize(size);
    setPlatterSelections([]);
  };

  const handleItemAdd = (item: any) => {
    if (!selectedPlatterSize) return;

    const maxItems = selectedPlatterSize.platters?.itemCount || 0;
    if (platterSelections.length < maxItems) {
      setPlatterSelections(prev => [...prev, item]);
    }
  };

  const handleItemRemove = (item: any) => {
    const index = platterSelections.findIndex(selected => selected.id === item.id);
    if (index !== -1) {
      setPlatterSelections(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getItemCount = (item: any) => {
    return platterSelections.filter(selected => selected.id === item.id).length;
  };

  const calculatePlatterPrice = () => {
    if (!selectedPlatterSize) return 0;

    const platterType = selectedPlatterSize.platters?.type;

    if (platterType === 'nigiri' || platterType === 'sashimi') {
      // For nigiri and sashimi platters, use fixed pricing (bulk pricing)
      return selectedPlatterSize.price;
    } else {
      // For mixed sushi platters, use dynamic pricing with 10% discount
      const totalItemPrice = platterSelections.reduce((total, item) => total + item.price, 0);
      const discount = selectedPlatterSize.platters?.discount || 0;
      return totalItemPrice * (1 - discount);
    }
  };

  const calculateTotalPrice = () => {
    const platterPrice = calculatePlatterPrice();
    const additionsPrice = Object.values(itemAdditions).flat().reduce((total, addition) =>
      total + (addition.item.price * addition.quantity), 0);
    return platterPrice + additionsPrice;
  };

  const handleAddToCart = () => {
    if (!selectedPlatterSize || platterSelections.length !== selectedPlatterSize.platters?.itemCount) {
      return;
    }

    const calculatedPrice = calculatePlatterPrice();
    const allAdditions = Object.values(itemAdditions).flat();
    const additionsPrice = allAdditions.reduce((total, addition) =>
      total + (addition.item.price * addition.quantity), 0);
    const totalPrice = calculatedPrice + additionsPrice;

    // Create description with additions
    let description = `${selectedPlatterSize.description}. Selected items: ${platterSelections.map(item => item.name).join(', ')}`;
    if (allAdditions.length > 0) {
      const additionsText = allAdditions.map(addition =>
        addition.quantity > 1 ? `${addition.quantity}× ${addition.item.name}` : addition.item.name
      ).join(', ');
      description += `. Additions: ${additionsText}`;
    }

    const platterItem = {
      id: `${selectedPlatter.id}-${selectedPlatterSize.id}-${Date.now()}`,
      name: `${selectedPlatter.name} - ${selectedPlatterSize.name}`,
      description,
      price: totalPrice,
      category: selectedPlatter.category,
      dietaryInfo: selectedPlatter.dietaryInfo,
      image: selectedPlatter.image,
      quantity: 1,
      customization: {
        size: selectedPlatterSize.name,
        selections: platterSelections.map(item => ({
          name: item.name,
          price: item.price,
          additions: itemAdditions[item.id] || []
        })),
        allAdditions: allAdditions.map(addition => ({
          name: addition.item.name,
          quantity: addition.quantity,
          price: addition.item.price
        }))
      }
    };
    onAddToCart(platterItem);
    onClose();
  };

  const handleAdditionsConfirm = (additions: { item: SushiItem; quantity: number }[]) => {
    if (selectedItemForAdditions) {
      setItemAdditions(prev => ({
        ...prev,
        [selectedItemForAdditions.id]: additions
      }));
    }
  };

  const handleItemAdditionsClick = (item: any) => {
    setSelectedItemForAdditions(item);
    setShowAdditionsModal(true);
  };

  if (!isOpen || !selectedPlatter) return null;

  // Get available items based on platter type
  const getAvailableItems = () => {
    if (selectedPlatterSize?.platters?.type === 'nigiri') {
      return availableNigiriOptions;
    } else if (selectedPlatterSize?.platters?.type === 'sashimi') {
      return availableSashimiOptions;
    }
    return availableSushiItems;
  };

  const availableItems = getAvailableItems();
  const maxItems = selectedPlatterSize?.platters?.itemCount || 0;
  const isComplete = platterSelections.length === maxItems;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl"
        style={{ color: 'rgb(15, 15, 15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">{selectedPlatter.name}</h2>
            <p className="text-gray-600 mt-1">
              {selectedPlatterSize ? 
                `Select ${maxItems - platterSelections.length} more items (${platterSelections.length}/${maxItems})` :
                'Choose your platter size first'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Size Selection */}
          {!selectedPlatterSize && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Platter Size</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedPlatter.sizes?.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeSelection(size)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors text-left"
                  >
                    <h4 className="font-semibold text-lg">{size.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{size.description}</p>
                    <p className="text-xl font-bold text-green-600 mt-2">
                      ${size.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Item Selection */}
          {selectedPlatterSize && (
            <>
              {/* Selected Items Summary - Fixed Height Container */}
              <div className="mb-6 min-h-[120px]">
                {platterSelections.length > 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold mb-2">
                      Selected Items ({platterSelections.length}/{maxItems}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {/* Group items by ID and show counts */}
                      {Array.from(new Set(platterSelections.map(item => item.id))).map((itemId) => {
                        const item = platterSelections.find(selected => selected.id === itemId);
                        const count = getItemCount(item);
                        const itemAdditionsCount = itemAdditions[itemId]?.length || 0;
                        return (
                          <div
                            key={itemId}
                            className="bg-white px-3 py-2 rounded-full text-sm border flex items-center gap-2"
                          >
                            <span className="font-medium">
                              {item?.name} {count > 1 && `(×${count})`}
                            </span>
                            {itemAdditionsCount > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {itemAdditionsCount}
                              </span>
                            )}
                            <button
                              onClick={() => handleItemRemove(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl opacity-50">
                    <h4 className="font-semibold mb-2">
                      Selected Items (0/{maxItems}):
                    </h4>
                    <p className="text-sm text-gray-500">No items selected yet</p>
                  </div>
                )}
              </div>

              {/* Available Items Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Available {selectedPlatterSize.platters?.type === 'nigiri' ? 'Nigiri' :
                            selectedPlatterSize.platters?.type === 'sashimi' ? 'Sashimi' : 'Sushi'} Options:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableItems.map((item) => {
                    const itemCount = getItemCount(item);
                    const canAdd = platterSelections.length < maxItems;

                    return (
                      <div
                        key={item.id}
                        className="border-2 border-gray-200 p-4 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            <p className="text-sm font-semibold text-green-600 mt-1">
                              ${item.price.toFixed(2)} each
                            </p>
                            {itemCount > 0 && (
                              <p className="text-xs font-medium text-blue-600 mt-1">
                                Selected: {itemCount}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              {itemCount > 0 && (
                                <button
                                  onClick={() => handleItemRemove(item)}
                                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleItemAdd(item)}
                                disabled={!canAdd}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  canAdd
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            {/* Individual Additions Button */}
                            {itemCount > 0 && (
                              <button
                                onClick={() => handleItemAdditionsClick(item)}
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors whitespace-nowrap"
                              >
                                + Add
                                {itemAdditions[item.id] && itemAdditions[item.id].length > 0 && (
                                  <span className="ml-1 bg-blue-200 text-blue-800 px-1 rounded-full text-xs">
                                    {itemAdditions[item.id].length}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additions Button */}
              {isComplete && (
                <div className="pt-4 border-t">
                  <div className="mb-4">
                    <button
                      onClick={() => setShowAdditionsModal(true)}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Plus size={20} />
                        <span className="font-semibold">Add Sides & Modifications</span>
                      </div>
                      {Object.values(itemAdditions).flat().length > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          {Object.values(itemAdditions).flat().length} addition{Object.values(itemAdditions).flat().length !== 1 ? 's' : ''} selected (+${Object.values(itemAdditions).flat().reduce((total, addition) => total + (addition.item.price * addition.quantity), 0).toFixed(2)})
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Price Breakdown and Add to Cart */}
              {isComplete && (
                <div className="pt-4 border-t">
                  {/* Price Breakdown */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Price Breakdown:</h4>

                    {selectedPlatterSize.platters?.type === 'nigiri' || selectedPlatterSize.platters?.type === 'sashimi' ? (
                      // Fixed pricing for nigiri/sashimi platters
                      <>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{selectedPlatterSize.name}</span>
                          <span>${selectedPlatterSize.price.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Includes: {Array.from(new Set(platterSelections.map(item => item.id))).map((itemId) => {
                            const item = platterSelections.find(selected => selected.id === itemId);
                            const count = getItemCount(item);
                            return `${item?.name}${count > 1 ? ` (×${count})` : ''}`;
                          }).join(', ')}
                        </div>
                      </>
                    ) : (
                      // Dynamic pricing for mixed sushi platters
                      <>
                        {Array.from(new Set(platterSelections.map(item => item.id))).map((itemId) => {
                          const item = platterSelections.find(selected => selected.id === itemId);
                          const count = getItemCount(item);
                          return (
                            <div key={itemId} className="flex justify-between text-sm mb-1">
                              <span>{item?.name} {count > 1 && `(×${count})`}</span>
                              <span>${(item?.price * count).toFixed(2)}</span>
                            </div>
                          );
                        })}
                        {selectedPlatterSize.platters?.discount > 0 && (
                          <div className="flex justify-between text-sm mb-1 text-green-600">
                            <span>Platter Discount ({(selectedPlatterSize.platters.discount * 100).toFixed(0)}% off)</span>
                            <span>-${(platterSelections.reduce((total, item) => total + item.price, 0) * selectedPlatterSize.platters.discount).toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Show additions if any */}
                    {Object.values(itemAdditions).flat().length > 0 && (
                      <>
                        <div className="border-t pt-2 mt-2">
                          <h5 className="font-semibold text-sm mb-2">Additions:</h5>
                          {Object.entries(itemAdditions).map(([itemId, additions]) => {
                            if (!additions || additions.length === 0) return null;
                            const item = platterSelections.find(selected => selected.id === itemId);
                            return (
                              <div key={itemId} className="mb-2">
                                <div className="text-xs text-gray-600 mb-1">For {item?.name}:</div>
                                {additions.map((addition, addIndex) => (
                                  <div key={addIndex} className="flex justify-between text-sm mb-1 ml-2">
                                    <span>{addition.item.name} {addition.quantity > 1 && `(×${addition.quantity})`}</span>
                                    <span>${(addition.item.price * addition.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">
                      Total: ${calculateTotalPrice().toFixed(2)}
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Additions Modal */}
      <SushiAdditionsModal
        isOpen={showAdditionsModal}
        onClose={() => {
          setShowAdditionsModal(false);
          setSelectedItemForAdditions(null);
        }}
        onAdditionsConfirm={handleAdditionsConfirm}
        selectedItem={selectedItemForAdditions}
      />
    </div>
  );
}
