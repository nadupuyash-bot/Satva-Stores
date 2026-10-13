export type CategoryId =
  | 'fashion'
  | 'shoes'
  | 'watches'
  | 'electronics'
  | 'bags'
  | 'home';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: CategoryId;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  specifications: Record<string, string>;
  features: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  reviews?: Review[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbanking';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending COD' | 'Failed';
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  estimatedDeliveryDate: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: ShippingAddress[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  description: string;
}
