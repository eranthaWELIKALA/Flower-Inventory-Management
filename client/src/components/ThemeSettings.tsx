import { useState } from 'react';
import { useTheme, ThemeColors } from '../contexts/ThemeContext';
import { ArrowLeft, Palette, RotateCcw, Check, Eye } from 'lucide-react';

interface ThemeSettingsProps {
  onBack: () => void;
}

export function ThemeSettings({ onBack }: ThemeSettingsProps) {
  const { currentTheme, themes, setTheme, updateTheme, resetTheme } = useTheme();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors>(currentTheme.colors);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [colorKey]: value }));
    updateTheme({ [colorKey]: value });
  };

  const handleApplyCustomTheme = () => {
    const customTheme = {
      name: 'Custom',
      colors: customColors
    };
    setTheme(customTheme);
    setIsCustomizing(false);
  };

  const handleReset = () => {
    resetTheme();
    setCustomColors(currentTheme.colors);
    setIsCustomizing(false);
  };

  const colorFields: { key: keyof ThemeColors; label: string; description: string }[] = [
    { key: 'primary', label: 'Primary', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary brand color' },
    { key: 'accent', label: 'Accent', description: 'Highlight color' },
    { key: 'background', label: 'Background', description: 'Page background' },
    { key: 'surface', label: 'Surface', description: 'Card/panel background' },
    { key: 'text', label: 'Text', description: 'Primary text color' },
    { key: 'textSecondary', label: 'Secondary Text', description: 'Secondary text color' },
    { key: 'border', label: 'Border', description: 'Border color' },
    { key: 'success', label: 'Success', description: 'Success state color' },
    { key: 'warning', label: 'Warning', description: 'Warning state color' },
    { key: 'error', label: 'Error', description: 'Error state color' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                Theme Settings
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Customize your application appearance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preset Themes */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Preset Themes
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setTheme(theme)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTheme.name === theme.name
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: currentTheme.name === theme.name ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>
                          {theme.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          {theme.name === 'Dark Mode' ? 'Dark theme' : 'Light theme'}
                        </p>
                      </div>
                      {currentTheme.name === theme.name && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex gap-1 mt-3">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'white'
                }}
              >
                {isCustomizing ? 'Cancel Customization' : 'Customize Colors'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border font-medium transition-colors flex items-center gap-2"
                style={{ 
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)'
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Custom Color Editor */}
          {isCustomizing && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                  Customize Colors
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {colorFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-sm font-medium"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {field.label}
                        </label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: customColors[field.key] }}
                          />
                          <input
                            type="color"
                            value={customColors[field.key]}
                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                            className="w-8 h-8 rounded border-0 cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                        {field.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleApplyCustomTheme}
                className="w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'white'
                }}
              >
                <Eye className="w-4 h-4" />
                Apply Custom Theme
              </button>
            </div>
          )}

          {/* Theme Preview */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Preview
            </h2>
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      Flower Shop
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Inventory Management
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <span className="text-white text-sm font-medium">Primary</span>
                  </div>
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    <span className="text-white text-sm font-medium">Secondary</span>
                  </div>
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    <span className="text-white text-sm font-medium">Accent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div 
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                      This is how your application will look with the selected theme.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

