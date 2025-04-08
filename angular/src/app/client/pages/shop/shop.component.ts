import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopSidebarComponent } from '../../components/shop/shop-sidebar/shop-sidebar.component';
import { ShopListComponent } from '../../components/shop/shop-list/shop-list.component';
import { HeadComponent } from '../../layout/head/head.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [
    ShopSidebarComponent, 
    ShopListComponent, 
    HeadComponent, 
    CommonModule],
})
export class ShopComponent {};





