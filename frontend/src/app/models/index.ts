export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isMain: boolean;
}

export interface ProductCustomization {
  id: string;
  optionName: string;
  optionValues: string[];
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  mainImageUrl: string;
  images: ProductImage[];
  customizations: ProductCustomization[];
}

export interface CartItem {
  id?: string; // Sepet kalemi için benzersiz ID
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  selectedCustomizations?: { [key: string]: string };
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'Customer' | 'Admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  recentProducts: any[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  completedDate: Date;
}

export interface CreatePortfolioItemRequest {
  title: string;
  description: string;
  category: string;
  images: string[];
  completedDate: Date;
}

export interface UpdatePortfolioItemRequest {
  title: string;
  description: string;
  category: string;
  images: string[];
  completedDate: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateMessageRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
}
