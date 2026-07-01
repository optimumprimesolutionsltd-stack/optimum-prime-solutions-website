import { useState } from 'react';
import { 
  Save, Plus, X, ChevronDown, Star, Copy, Trash2, 
  Package, DollarSign, Layers
} from 'lucide-react';
import type { SiteData, ProductItem } from '../../data/siteData';

interface P { data: SiteData; onSave: (d: SiteData) => void }

const defaultFeatures = [
  'Single user license',
  'All accounting features', 
  'Inventory management',
  'Payroll processing',
  'KRA compliance',
  'eTIMS integration',
  'Free updates for 1 year',
  'Email support',
  'Remote access',
  'Multi-user support',
  'Advanced security',
  'Priority support',
  'On-site training',
  'Custom reports',
  'API access'
];

export default function ProductsEditor({ data, onSave }: P) {
  const [items, setItems] = useState<ProductItem[]>(
    data.products.map(p => ({ ...p, features: [...p.features] }))
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: 'TallyPrime',
      edition: 'New Edition',
      price: 'KES 0',
      period: 'one-time',
      features: ['Feature 1', 'Feature 2'],
      popular: false,
      cta: 'Get Started'
    };
    setItems([...items, newProduct]);
    setExpandedId(newProduct.id);
  };

  const duplicateProduct = (product: ProductItem) => {
    const dup: ProductItem = {
      ...product,
      id: Date.now().toString(),
      edition: `${product.edition} (Copy)`,
      popular: false
    };
    setItems([...items, dup]);
    setExpandedId(dup.id);
  };

  const removeProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setItems(items.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setItems(items.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPresetProduct = (type: 'silver' | 'gold' | 'custom') => {
    const presets: Record<string, Partial<ProductItem>> = {
      silver: {
        name: 'TallyPrime',
        edition: 'Silver',
        price: 'KES 54,000',
        period: 'one-time',
        features: [
          'Single user license',
          'All accounting features',
          'Inventory management',
          'Payroll processing',
          'KRA compliance',
          'eTIMS integration',
          'Free updates for 1 year',
          'Email support'
        ],
        popular: false,
        cta: 'Get Silver'
      },
      gold: {
        name: 'TallyPrime',
        edition: 'Gold',
        price: 'KES 162,000',
        period: 'one-time',
        features: [
          'Unlimited multi-user',
          'All Silver features',
          'Remote access',
          'Advanced security',
          'Multi-location support',
          'Priority support',
          'On-site training',
          'Custom reports'
        ],
        popular: true,
        cta: 'Get Gold'
      },
      custom: {
        name: 'TallyPrime',
        edition: 'Enterprise',
        price: 'Custom Quote',
        period: 'per project',
        features: [
          'Custom TDL development',
          'Workflow automation',
          'Third-party integrations',
          'API development',
          'Dedicated developer',
          'Source code delivery',
          '12 months support',
          'Enterprise SLA'
        ],
        popular: false,
        cta: 'Contact Sales'
      }
    };

    const newProduct: ProductItem = {
      id: Date.now().toString(),
      ...presets[type]
    } as ProductItem;

    setItems([...items, newProduct]);
    setExpandedId(newProduct.id);
    setShowPresetModal(false);
  };

  const moveProduct = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  const formatPrice = (price: string) => {
    // Auto-format price input
    if (!price.includes('KES') && !isNaN(Number(price.replace(/[^0-9]/g, '')))) {
      const num = price.replace(/[^0-9]/g, '');
      if (num) return `KES ${Number(num).toLocaleString()}`;
    }
    return price;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-navy-500">{items.length} products/licenses</p>
          <p className="text-xs text-navy-400">Manage your TallyPrime pricing tiers</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPresetModal(true)}
            className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition"
          >
            <Layers className="h-4 w-4" />
            Add from Preset
          </button>
          <button 
            onClick={addProduct}
            className="flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition"
          >
            <Plus className="h-4 w-4" />
            Add Custom
          </button>
        </div>
      </div>

      {/* Preset Modal */}
      {showPresetModal && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-navy-900">Quick Add Preset License</h4>
            <button onClick={() => setShowPresetModal(false)} className="text-navy-400 hover:text-navy-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'silver', label: 'Silver', desc: 'Single user', price: 'KES 54,000', color: 'from-gray-400 to-gray-500' },
              { key: 'gold', label: 'Gold', desc: 'Multi-user', price: 'KES 162,000', color: 'from-amber-400 to-yellow-500' },
              { key: 'custom', label: 'Enterprise', desc: 'Custom TDL', price: 'Quote', color: 'from-accent to-blue-500' }
            ].map(preset => (
              <button
                key={preset.key}
                onClick={() => addPresetProduct(preset.key as 'silver' | 'gold' | 'custom')}
                className="rounded-xl border border-navy-200 bg-white p-4 text-left hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${preset.color} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-bold text-navy-900">{preset.label}</p>
                <p className="text-xs text-navy-500">{preset.desc}</p>
                <p className="text-xs font-semibold text-accent mt-1">{preset.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products List */}
      {items.map((product, index) => {
        const isExpanded = expandedId === product.id;
        return (
          <div 
            key={product.id} 
            className={`rounded-2xl border bg-white overflow-hidden transition-all ${
              isExpanded ? 'border-accent/30 shadow-lg' : 'border-navy-200'
            } ${product.popular ? 'ring-1 ring-accent/20' : ''}`}
          >
            {/* Header */}
            <div 
              className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : product.id)}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
                    <Star className="h-3 w-3 fill-accent" />
                    POPULAR
                  </span>
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-navy-400 shrink-0" />
                  <p className="text-sm font-bold text-navy-900 truncate">
                    {product.name} {product.edition}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs font-semibold text-accent">{product.price}</span>
                  <span className="text-[10px] text-navy-400">• {product.period}</span>
                  <span className="text-[10px] text-navy-400">• {product.features.length} features</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); duplicateProduct(product); }}
                  className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-600"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveProduct(index, -1); }}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveProduct(index, 1); }}
                  disabled={index === items.length - 1}
                  className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeProduct(product.id); }}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expanded Editor */}
            {isExpanded && (
              <div className="border-t border-navy-100 p-5 space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">Product Name</label>
                    <input 
                      value={product.name} 
                      onChange={e => updateProduct(product.id, { name: e.target.value })}
                      className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                      placeholder="TallyPrime"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">Edition/Type</label>
                    <input 
                      value={product.edition} 
                      onChange={e => updateProduct(product.id, { edition: e.target.value })}
                      className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                      placeholder="Silver / Gold / Custom"
                    />
                  </div>
                </div>

                {/* Price & Period */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">
                      <DollarSign className="h-3 w-3 inline mr-1" />
                      Price
                    </label>
                    <input 
                      value={product.price} 
                      onChange={e => updateProduct(product.id, { price: e.target.value })}
                      onBlur={e => updateProduct(product.id, { price: formatPrice(e.target.value) })}
                      className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                      placeholder="KES 54,000"
                    />
                    <p className="text-[10px] text-navy-400 mt-1">Format: KES 54,000 or "Custom Quote"</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1.5">Billing Period</label>
                    <select 
                      value={product.period} 
                      onChange={e => updateProduct(product.id, { period: e.target.value })}
                      className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                    >
                      <option value="one-time">One-time</option>
                      <option value="per year">Per Year</option>
                      <option value="per month">Per Month</option>
                      <option value="per user/year">Per User/Year</option>
                      <option value="per project">Per Project</option>
                    </select>
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">Button Text</label>
                  <input 
                    value={product.cta} 
                    onChange={e => updateProduct(product.id, { cta: e.target.value })}
                    className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                    placeholder="Get Started / Buy Now / Contact Sales"
                  />
                </div>

                {/* Popular Toggle */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!product.popular} 
                      onChange={e => updateProduct(product.id, { popular: e.target.checked })}
                      className="h-4 w-4 rounded border-navy-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-navy-700">Mark as Most Popular / Recommended</span>
                  </label>
                  {product.popular && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                      <Star className="h-3 w-3 fill-accent" /> FEATURED
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-2">
                    Features Included ({product.features.length})
                  </label>
                  <div className="space-y-2">
                    {product.features.map((feature, fi) => (
                      <div key={fi} className="flex gap-2">
                        <input 
                          value={feature} 
                          onChange={e => {
                            const features = [...product.features];
                            features[fi] = e.target.value;
                            updateProduct(product.id, { features });
                          }}
                          className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-sm outline-none focus:border-accent"
                          placeholder="Feature description..."
                        />
                        <button 
                          onClick={() => {
                            const features = product.features.filter((_, idx) => idx !== fi);
                            updateProduct(product.id, { features });
                          }}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateProduct(product.id, { features: [...product.features, ''] })}
                        className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Feature
                      </button>
                      <select 
                        onChange={e => {
                          if (e.target.value) {
                            updateProduct(product.id, { features: [...product.features, e.target.value] });
                            e.target.value = '';
                          }
                        }}
                        className="text-xs border border-navy-200 rounded-lg px-2 py-1 outline-none focus:border-accent"
                      >
                        <option value="">+ Quick add...</option>
                        {defaultFeatures.filter(f => !product.features.includes(f)).map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-navy-200 bg-navy-50/50 py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-navy-300" />
          <p className="mt-4 text-sm font-medium text-navy-600">No products yet</p>
          <p className="mt-1 text-xs text-navy-400">Add your first TallyPrime license using the buttons above</p>
          <button 
            onClick={() => setShowPresetModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> Add Your First Product
          </button>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-navy-200">
        <div className="text-xs text-navy-400">
          Last saved: {new Date().toLocaleTimeString()}
        </div>
        <button 
          onClick={() => onSave({ ...data, products: items })}
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-navy-800 hover:scale-[1.02] transition-all"
        >
          <Save className="h-4 w-4" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
