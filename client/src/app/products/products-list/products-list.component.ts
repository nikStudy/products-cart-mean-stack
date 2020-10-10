import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: [];
  datasaved = false;
  message = '';

  query: string;
  orderProp: string;

  constructor(private productservice: ProductsService) { }

  ngOnInit(): void {
    this.datasaved = false;
    this.message = '';
    this.getAllProducts();
  }

  getAllProducts() {
    this.productservice.getProducts().subscribe(data => {
      console.log(data);
      if (data.success) {
        this.datasaved = true;
        this.message = data.message;
        this.products = data.products;
      }
    });
  }

  addToCart(productId) {
    this.productservice.addItemToCart(productId).subscribe(data => {
      // console.log(data);
    });
  }


  // filter and sort functions
  getProducts(): [] {
    return this.sortProducts(this.filterProducts(this.products));
  }
  
  private filterProducts(products) {
    if (products && this.query) {
      return products.filter(product => {
        let title = product.title.toLowerCase();
        // let short_descrip = product.short_descrip.toLowerCase();
        let price = product.price.toLocaleString();
        this.query = this.query.toLowerCase();
        // return title.indexOf(this.query) >= 0 || short_descrip.indexOf(this.query) >= 0 || price.indexOf(this.query) >= 0;
        return title.indexOf(this.query) >= 0 || price.indexOf(this.query) >= 0;
      });
    }
    return products;
  }
  
  private sortProducts(products) {
    if (products && this.orderProp) {

      if (this.orderProp === "inversePrice") {
        return products
        .slice(0) // Make a copy
        .sort((a, b) => {
          if (a["price"] > b["price"]) {
            return -1;
          } else if ([b["price"] > a["price"]]) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      return products
        .slice(0) // Make a copy
        .sort((a, b) => {
          if (a[this.orderProp] < b[this.orderProp]) {
            return -1;
          } else if ([b[this.orderProp] < a[this.orderProp]]) {
            return 1;
          } else {
            return 0;
          }
        });
    }
    return products;
  }




}
