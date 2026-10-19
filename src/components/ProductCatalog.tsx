import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, FabricType } from '../types';
import { Search, SlidersHorizontal, ShoppingBag, Eye, X, Check } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'New Collection',
  'Pakistani Suits',
  'Kurtis',
  'Suits',
  'Daily Wear',
  'Office Wear'
];

const FABRICS: (FabricType | 'All')[] = [
  'All',
  'Raw Silk',
  'Chiffon',
  'Organza',
  'Velvet',
  'Pure Lawn',
  'Georgette',
  'Cotton'
];

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedFabric,
    setSelectedFabric,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setSelectedProduct,
    addToCart
  } = useStore();

  const [priceMax, setPriceMax] = useState<number>(10000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Fabric filter
      if (selectedFabric !== 'All' && product.fabric !== selectedFabric) {
        return false;
      }
      // Price filter
      if (product.price > priceMax) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesFabric = product.fabric.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesFabric && !matchesDesc && !matchesSku) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.rating - a.rating; // default popular
    });
  }, [products, selectedCategory, selectedFabric, priceMax, searchQuery, sortBy]);

  const handleWhatsAppEnquire = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hello HOOR FAB! I would like to inquire about "${product.title}" (${product.category}, SKU: ${product.sku}) listed at ₹${product.price.toLocaleString('en-IN')}. Is it available?`
    );
    window.open(`https://wa.me/918100032281?text=${message}`, '_blank');
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    addToCart(product, defaultSize, true, 1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSearchQuery('');
    setPriceMax(10000);
    setSortBy('popular');
  };

  return (
    <section id="product-catalog-section" className="py-12 sm:py-16 bg-[#fbf7f1] min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-10 bg-[#c8b398]" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#886e53]">
              HAUTE COUTURE CATALOG
            </span>
            <div className="h-[1px] w-10 bg-[#c8b398]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#342a20] tracking-tight">
            Curated Women's Wear
          </h2>
          <p className="text-sm sm:text-base text-[#6f5e4e] mt-3">
            Explore authentic Pakistani suits, festive formals, and hand-tailored everyday grace.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#f6eee3] rounded-2xl p-4 sm:p-5 border border-[#e3d5c4] shadow-sm mb-8 space-y-4">
          
          {/* Top row: Category Segmented Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#786550] text-white shadow-sm'
                    : 'bg-[#ede2d4]/70 text-[#4c3e30] hover:bg-[#ede2d4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary row: Search, Fabric, Sort, and Price Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#e8ddce]">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a7664] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search style, fabric, or SKU..."
                className="w-full pl-9 pr-3 py-2 bg-[#fdfbfa] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#382d22] placeholder-[#9c8976] focus:outline-none focus:ring-1 focus:ring-[#786550]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7664] hover:text-[#382d22]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Fabric Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#6b5846] whitespace-nowrap">
                Fabric:
              </label>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value as FabricType | 'All')}
                className="w-full py-2 px-3 bg-[#fdfbfa] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#382d22] focus:outline-none focus:ring-1 focus:ring-[#786550]"
              >
                {FABRICS.map((fab) => (
                  <option key={fab} value={fab}>
                    {fab === 'All' ? 'All Fabrics' : fab}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#6b5846] whitespace-nowrap">
                Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2 px-3 bg-[#fdfbfa] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#382d22] focus:outline-none focus:ring-1 focus:ring-[#786550]"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Price Max Slider */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-[#6b5846] whitespace-nowrap">
                Max: ₹{priceMax.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#786550] cursor-pointer"
              />
            </div>

          </div>

          {/* Active Filter Indicators */}
          {(selectedCategory !== 'All' || selectedFabric !== 'All' || searchQuery || priceMax < 10000) && (
            <div className="flex items-center justify-between text-xs text-[#725e4c] pt-1">
              <div className="flex items-center gap-2">
                <span>Showing {filteredProducts.length} filtered styles</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[#8e382b] font-medium hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-[#fcf9f5] rounded-2xl overflow-hidden border border-[#e5d8c7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-[#ebd8c4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Corner Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="bg-[#483a2d]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md shadow-sm">
                        New
                      </span>
                    )}
                    {product.stockCount <= 5 && product.stockCount > 0 && (
                      <span className="bg-[#94392e]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
                        Only {product.stockCount} Left
                      </span>
                    )}
                    {product.stockCount === 0 && (
                      <span className="bg-red-700 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Fabric Tag */}
                  <div className="absolute bottom-3 left-3 bg-[#fcf9f5]/90 backdrop-blur-md text-[#554535] text-[11px] font-medium px-2 py-0.5 rounded border border-[#dfd1bf]">
                    {product.fabric}
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-[#292017]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="p-2.5 bg-white text-[#382d22] rounded-full shadow-lg hover:bg-[#f6eee3] transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {product.inStock && (
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="p-2.5 bg-[#786550] text-white rounded-full shadow-lg hover:bg-[#5f4e3c] transition-colors"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#806d59] mb-1">
                      <span>{product.category}</span>
                      <span className="text-[11px] font-mono opacity-80">{product.sku}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#342a20] group-hover:text-[#786550] transition-colors leading-snug line-clamp-1">
                      {product.title}
                    </h3>
                    
                    <p className="text-xs text-[#6e5d4d] line-clamp-2 mt-1">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price and Sizes */}
                  <div className="pt-2 border-t border-[#ede2d4]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#342a20] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-[#9d8976] line-through tabular-nums">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      {/* Available sizes indicators */}
                      <div className="flex items-center gap-1 text-[10px] text-[#786550] font-medium">
                        {product.sizes.slice(0, 3).map((s) => (
                          <span key={s} className="px-1 border border-[#dacbb8] rounded bg-[#f6eee4]">
                            {s}
                          </span>
                        ))}
                        {product.sizes.length > 3 && <span>+{product.sizes.length - 3}</span>}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={(e) => handleWhatsAppEnquire(e, product)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#786550] hover:bg-[#63513e] text-white rounded-xl text-xs font-medium tracking-wide shadow-sm transition-all"
                    >
                      <WhatsAppIcon size={15} color="#ffffff" />
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 bg-[#f7f0e6] rounded-2xl border border-[#ded0bf] p-8 max-w-lg mx-auto">
            <p className="font-serif text-xl font-bold text-[#3d3126]">
              No Matching Styles Found
            </p>
            <p className="text-sm text-[#73604f] mt-2 mb-5">
              Try adjusting your category, fabric, or price filters to see more of our collection.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#786550] text-white text-xs font-semibold rounded-full hover:bg-[#62513f] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
