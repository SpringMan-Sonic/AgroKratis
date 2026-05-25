import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const SeedForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    nameLocal: { te: '', hi: '', ta: '', ml: '', kn: '' },
    costPerKg: '',
    stock: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLocalNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      nameLocal: { ...prev.nameLocal, [lang]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <Input
        label="Seed Name (English)"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Telugu"
          value={formData.nameLocal.te}
          onChange={(e) => handleLocalNameChange('te', e.target.value)}
          required
        />
        <Input
          label="Hindi"
          value={formData.nameLocal.hi}
          onChange={(e) => handleLocalNameChange('hi', e.target.value)}
          required
        />
        <Input
          label="Tamil"
          value={formData.nameLocal.ta}
          onChange={(e) => handleLocalNameChange('ta', e.target.value)}
          required
        />
        <Input
          label="Malayalam"
          value={formData.nameLocal.ml}
          onChange={(e) => handleLocalNameChange('ml', e.target.value)}
          required
        />
        <Input
          label="Kannada"
          value={formData.nameLocal.kn}
          onChange={(e) => handleLocalNameChange('kn', e.target.value)}
          required
          className="col-span-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cost per KG (₹)"
          type="number"
          value={formData.costPerKg}
          onChange={(e) => setFormData({ ...formData, costPerKg: e.target.value })}
          required
        />
        <Input
          label="Stock (grams)"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          {initialData ? 'Update' : 'Add'} Seed
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default SeedForm;