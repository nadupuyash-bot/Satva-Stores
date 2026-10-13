import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { Product, CategoryId, OrderStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    categories,
    orders,
    user,
    login,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    resetCatalog,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Search in admin products
  const [productSearch, setProductSearch] = useState('');

  // Form state for creating / editing product
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    description: '',
    price: 4999,
    originalPrice: 6999,
    discountPercentage: 28,
    category: 'fashion' as CategoryId,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    reviewCount: 12,
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
  });

  // Authorization check
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900 font-display">
            Restricted Administrator Area
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The YASHU administration console requires privileged management credentials.
          </p>
          <div className="pt-2">
            <button
              onClick={() => login('admin@yashu.com', 'admin', 'Yashu Verma')}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Authenticate as Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const totalCatalogInventory = products.reduce((sum, p) => sum + p.stock, 0);

  // Weekly sales mock series for charts
  const weeklySalesData = [
    { day: 'Mon', sales: 42000, orders: 4 },
    { day: 'Tue', sales: 58000, orders: 6 },
    { day: 'Wed', sales: 74000, orders: 7 },
    { day: 'Thu', sales: 61000, orders: 5 },
    { day: 'Fri', sales: 98000, orders: 11 },
    { day: 'Sat', sales: 135000, orders: 16 },
    { day: 'Sun', sales: 112000, orders: 13 },
  ];
  const maxWeeklySales = Math.max(...weeklySalesData.map((d) => d.sales));

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      tagline: '',
      description: '',
      price: 3999,
      originalPrice: 4999,
      discountPercentage: 20,
      category: 'fashion',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
      rating: 4.8,
      reviewCount: 1,
      stock: 25,
      sizes: ['S', 'M', 'L'],
      isFeatured: false,
      isTrending: false,
      isNewArrival: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      tagline: prod.tagline,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discountPercentage: prod.discountPercentage || 0,
      category: prod.category,
      images: prod.images,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      stock: prod.stock,
      sizes: prod.sizes || ['M'],
      isFeatured: prod.isFeatured || false,
      isTrending: prod.isTrending || false,
      isNewArrival: prod.isNewArrival || false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          ...productForm,
        });
      }
    } else {
      addProduct({
        ...productForm,
        specifications: {
          Origin: 'YASHU Atelier Selection',
          Craft: 'Hand-inspected precision batch',
        },
        features: ['Signature minimal tailoring', 'Premium sustainable components'],
      });
    }

    setIsProductModalOpen(false);
  };

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-neutral-900 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-xs text-neutral-400">Authenticated: {user.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 font-display">
            YASHU Atelier Operations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetCatalog}
            className="flex items-center gap-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Restore Seed Catalog</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-neutral-200 space-x-6">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'analytics'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Overview & Sales
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'products'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'orders'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Order Fulfillments ({orders.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                {formatPrice(totalRevenue + 580000)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% compared to last cycle</span>
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-neutral-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                {totalOrdersCount + 142}
              </div>
              <span className="text-[11px] text-neutral-400 mt-2 block">
                {orders.filter((o) => o.status === 'Processing').length} awaiting fulfillment
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Inventory</span>
                <Package className="w-4 h-4 text-neutral-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                {totalCatalogInventory}
              </div>
              <span className="text-[11px] text-neutral-400 mt-2 block">
                Across {products.length} live SKU creations
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Low Stock Watch</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">
                {lowStockProducts.length}
              </div>
              <span className="text-[11px] text-amber-600 mt-2 block">
                Items with 10 or fewer units in warehouse
              </span>
            </div>
          </div>

          {/* Sales Performance Chart (Visual CSS/SVG bar chart) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-display">
                  Weekly Sales Volume & Inflow
                </h3>
                <p className="text-xs text-neutral-500">
                  Daily revenue trajectory across all product categories
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                7-Day Run: ₹5,80,000 Total
              </span>
            </div>

            {/* Bars container */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 border-b border-neutral-200">
              {weeklySalesData.map((d, i) => {
                const heightPercent = Math.round((d.sales / maxWeeklySales) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(d.sales)}
                    </div>
                    <div
                      className="w-full max-w-[48px] bg-neutral-900 group-hover:bg-amber-600 rounded-t-xl transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute top-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 mt-1">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT TABLE */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full text-xs bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-neutral-900"
              />
            </div>
            <span className="text-xs text-neutral-500">
              Showing {filteredCatalog.length} products
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock In-Hand</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCatalog.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-neutral-900">{prod.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">ID: {prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-neutral-900">{formatPrice(prod.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={prod.stock}
                          onChange={(e) => updateStock(prod.id, Number(e.target.value))}
                          className={`w-16 px-2 py-1 rounded-lg border text-xs font-mono font-bold ${
                            prod.stock <= 10
                              ? 'border-amber-400 bg-amber-50 text-amber-800'
                              : 'border-neutral-200 bg-white text-neutral-900'
                          }`}
                        />
                        {prod.stock <= 10 && (
                          <span className="text-[10px] font-semibold text-amber-700">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-neutral-700">
                      ★ {prod.rating} ({prod.reviewCount})
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status & Pipeline</th>
                <th className="p-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                  <td className="p-4">
                    <div className="font-semibold text-neutral-900">{ord.shippingAddress.fullName}</div>
                    <div className="text-[11px] text-neutral-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                  </td>
                  <td className="p-4 text-neutral-600">{ord.items.length} item(s)</td>
                  <td className="p-4 font-bold text-neutral-900">{formatPrice(ord.total)}</td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-neutral-50 border border-neutral-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono font-bold uppercase bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded">
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 font-display">
              {editingProductId ? 'Edit Product Creation' : 'Add New Creation to Catalog'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Minimalist Poplin Shirt"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tagline / Catchphrase *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="e.g. 100% Giza cotton tailored for modern drape"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value as CategoryId })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Inventory Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Product Image URL (High-Res Unsplash or Web Link)
                </label>
                <input
                  type="url"
                  required
                  value={productForm.images[0] || ''}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      images: [e.target.value, ...(productForm.images.slice(1) || [])],
                    })
                  }
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-neutral-900"
                  />
                  <span>Featured Piece</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isTrending}
                    onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                    className="accent-neutral-900"
                  />
                  <span>Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                    className="accent-neutral-900"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl uppercase tracking-wider shadow-sm"
                >
                  Save Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
