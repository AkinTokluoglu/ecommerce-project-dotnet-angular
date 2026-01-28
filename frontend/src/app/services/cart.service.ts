import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Cart } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = signal<CartItem[]>([]);

    readonly cart = computed<Cart>(() => ({
        items: this.cartItems(),
        totalAmount: this.cartItems().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    }));

    readonly itemCount = computed(() =>
        this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
    );

    addToCart(item: CartItem): void {
        const items = this.cartItems();

        // Varyant kontrolü: Hem productId hem de options aynı mı?
        const existingItemIndex = items.findIndex(i =>
            i.productId === item.productId &&
            this.areOptionsEqual(i.selectedCustomizations, item.selectedCustomizations)
        );

        if (existingItemIndex >= 0) {
            const updated = [...items];
            updated[existingItemIndex].quantity += item.quantity;
            this.cartItems.set(updated);
        } else {
            // Yeni item için ID oluştur
            const newItem = {
                ...item,
                id: item.id || this.generateId()
            };
            this.cartItems.set([...items, newItem]);
        }
        this.saveToStorage();
    }

    removeFromCart(cartItemId: string): void {
        // ID'ye göre sil (productId değil)
        this.updateCartState(this.cartItems().filter(i => i.id !== cartItemId));
    }

    updateQuantity(cartItemId: string, quantity: number): void {
        const currentCart = this.cart();
        if (quantity <= 0) {
            this.removeFromCart(cartItemId);
            return;
        }

        const itemIndex = currentCart.items.findIndex(i => i.id === cartItemId);
        if (itemIndex > -1) {
            const updatedItems = [...currentCart.items];
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity };
            this.updateCartState(updatedItems);
        }
    }

    clearCart(): void {
        this.updateCartState([]);
    }

    private updateCartState(items: CartItem[]): void {
        this.cartItems.set(items);
        this.saveToStorage();
    }

    // Helper: İki opsiyon objesinin eşit olup olmadığını kontrol et
    private areOptionsEqual(opt1?: { [key: string]: string }, opt2?: { [key: string]: string }): boolean {
        const k1 = opt1 ? Object.keys(opt1).sort() : [];
        const k2 = opt2 ? Object.keys(opt2).sort() : [];

        if (k1.length !== k2.length) return false;

        for (const key of k1) {
            if (opt1![key] !== opt2![key]) return false;
        }

        return true;
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private saveToStorage(): void {
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }

    loadFromStorage(): void {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.cartItems.set(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading cart', e);
                localStorage.removeItem('cart');
            }
        }
    }
}
