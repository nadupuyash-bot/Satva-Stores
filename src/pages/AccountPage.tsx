import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../utils/formatters';

export const AccountPage: React.FC = () => {
  const { user, login, logout, orders, updateUserProfile, addSavedAddress } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Login form state if not logged in
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'customer' | 'admin'>('customer');

  // Edit profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // Add new address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    login(emailInput.trim(), roleInput, nameInput.trim() || 'Valued Shopper');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: editName, phone: editPhone });
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.city || !newAddr.pinCode) return;
    addSavedAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine1: '',
      city: '',
      state: '',
      pinCode: '',
    });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
              Y
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight font-display">
              Welcome to YASHU
            </h1>
            <p className="text-xs text-neutral-500">
              Sign in to manage your orders, saved addresses, and profile.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Yashu Verma"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Role Persona
              </label>
              <select
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as any)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all cursor-pointer"
              >
                <option value="customer">Customer / Patron</option>
                <option value="admin">Store Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-colors shadow-sm"
            >
              Sign In to Account
            </button>
          </form>

          {/* Quick Demo Switchers */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
              Or 1-Click Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => login('shopper@yashu.com', 'customer', 'Priya Sharma')}
                className="p-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-center"
              >
                Shopper Demo
              </button>
              <button
                type="button"
                onClick={() => login('admin@yashu.com', 'admin', 'Yashu Verma')}
                className="p-2.5 rounded-xl border border-neutral-900 bg-neutral-900 text-white text-xs font-semibold text-center flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders; // Show current orders

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Profile card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-neutral-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <span className="bg-neutral-900 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-xs"
            >
              Open Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-neutral-200 space-x-6 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'orders'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Order History ({userOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'profile'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Customer Profile
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'addresses'
              ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Saved Addresses ({user.addresses.length})
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900 mb-1">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 mb-4">
                Explore our catalog and make your first acquisition.
              </p>
              <Link
                to="/shop"
                className="bg-neutral-900 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            userOrders.map((ord) => {
              const statusColors = {
                Pending: 'bg-amber-50 text-amber-800 border-amber-200',
                Processing: 'bg-blue-50 text-blue-800 border-blue-200',
                Shipped: 'bg-purple-50 text-purple-800 border-purple-200',
                Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                Cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
              };

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-neutral-50 border-b border-neutral-100 flex flex-wrap justify-between items-center gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Order Identifier</span>
                        <span className="font-mono font-bold text-neutral-900">{ord.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Placed On</span>
                        <span className="font-semibold text-neutral-900">{formatDate(ord.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Total Value</span>
                        <span className="font-bold text-neutral-900">{formatPrice(ord.total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          statusColors[ord.status] || 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <Link
                        to={`/order-success/${ord.id}`}
                        className="bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold px-3 py-1.5 rounded-xl transition-colors text-xs"
                      >
                        View Receipt
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 divide-y divide-neutral-100">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-16 object-cover rounded-xl bg-neutral-100 border border-neutral-100"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{item.productName}</h4>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-6 font-display">
            Personal Details
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full text-xs bg-neutral-100 border border-neutral-200 rounded-xl p-3 outline-none text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
              Saved Delivery Addresses
            </h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add address modal/form */}
          {isAddingAddress && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-300 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                New Address Details
              </h4>
              <form onSubmit={handleSaveNewAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Building, Apartment"
                    value={newAddr.addressLine1}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code"
                    value={newAddr.pinCode}
                    onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none font-mono"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-neutral-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="border border-neutral-200 text-neutral-600 text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{addr.fullName}</span>
                  {i === 0 && (
                    <span className="text-[10px] bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Primary Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-xs text-neutral-500">{addr.addressLine2}</p>}
                <p className="text-xs text-neutral-600">
                  {addr.city}, {addr.state} - {addr.pinCode}
                </p>
                <p className="text-xs text-neutral-500 font-mono">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
