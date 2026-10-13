import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    cartItemCount,
    wishlist,
    user,
    logout,
    login,
    setIsCartOpen,
    setIsSearchOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* YASHU Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-xl shadow-xs group-hover:scale-105 transition-transform">
                Y
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-[0.2em] uppercase font-display text-neutral-900 leading-none">
                  YASHU
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-semibold mt-0.5">
                  STUDIO
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                    active
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Account */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 text-neutral-700" />
              <span className="hidden md:inline text-xs text-neutral-400 font-medium font-mono">
                Ctrl+K
              </span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-colors border border-transparent hover:border-neutral-200"
                aria-label="User Account Menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-300"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-neutral-600" />
                  </div>
                )}
                <span className="hidden md:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
              </button>

              {/* Account Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.role === 'admin' && (
                            <span className="bg-neutral-900 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 rounded uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-400" />
                          <span>My Profile & Orders</span>
                        </Link>

                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 font-medium"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Admin Dashboard</span>
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                            Manage
                          </span>
                        </Link>
                      </div>

                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-neutral-900">Welcome to YASHU</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Sign in to manage orders, wishlists, and track shipments.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            login('shopper@yashu.com', 'customer', 'Priya Sharma');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors uppercase tracking-wider"
                        >
                          Customer Sign In
                        </button>
                        <button
                          onClick={() => {
                            login('admin@yashu.com', 'admin', 'Yashu Verma');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Demo Sign In</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-colors ${
                  isActive(link.path)
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Management
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
