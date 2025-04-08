import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  subtotal: number = 0;
  total: number = 0;
  shipping = { method: 'Free shipping', fee: 0 };

  constructor(private cartService: CartService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadCart();
    this.cartService.cart$.subscribe((cartData) => {
      this.cart = cartData;
      this.calculateTotals();
    });
  }

  loadCart() {
    this.cartService.loadCart().subscribe();
  }

  calculateTotals() {
    this.subtotal = this.cart.reduce((acc, item) => acc + (item?.productId?.salePrice || 0) * item.quantity, 0);
    this.total = this.subtotal + this.shipping.fee;
  }

  increaseQuantity(productId: string, currentQuantity: number) {
    if (currentQuantity >= 100) {
      alert('Maximum quantity reached (100).');
      return;
    }
    this.updateCartQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: string, currentQuantity: number) {
    if (currentQuantity > 1) {
      this.updateCartQuantity(productId, currentQuantity - 1);
    }
  }

  updateCartQuantity(productId: string, quantity: number) {
    this.cartService.updateCartQuantity(productId, quantity).subscribe();
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.notificationService.showNotification('Item removed from cart.', 'success');
    });
  }

  changeShipping(method: string, fee: number) {
    this.shipping = { method, fee };
    this.calculateTotals();
  }
}
