import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  datasaved = false;
  message = '';
  loading = true;

  constructor(private productservice: ProductsService, public router: Router) { }

  ngOnInit(): void {
    this.datasaved = false;
    this.message = '';
    // console.log(this.router.url);
    let productId = this.router.url;
    this.getProduct(productId);
  }

  getProduct(productId) {
    this.productservice.getProductById(productId).subscribe(data => {
      // console.log(data);
      if (data.success) {
        this.datasaved = true;
        this.message = data.message;
        this.product = data.product;
        this.loading = false;
      }
    });
  }

  addToCart(productId) {
    this.productservice.addItemToCart(productId).subscribe(data => {
      // console.log(data);
    });
  }

}
