import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { HeaderComponent } from './layout/header/header.component';
import { CategoriesComponent } from './categories/categories.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { ColorsComponent } from './colors/colors.component';
import { BrandsComponent } from './brands/brands.component';
import { SizesComponent } from './sizes/sizes.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { ImportinvoicesComponent } from './importinvoices/importinvoices.component';
import { DetailproductsComponent } from './products/detailproducts/detailproducts.component';
import { UsersComponent } from './users/users.component';
import { DatePipe } from '@angular/common';
import { DetailimportvoicesComponent } from './importinvoices/detailimportvoices/detailimportvoices.component';
import { BillofsaleComponent } from './billofsale/billofsale.component';
import { DetailbillofsaleComponent } from './billofsale/detailbillofsale/detailbillofsale.component';
import { TransportComponent } from './transport/transport.component';
import { VoucherComponent } from './voucher/voucher.component';
import { CategoryvoucherComponent } from './voucher/categoryvoucher/categoryvoucher.component';
import { NewsComponent } from './news/news.component';
import { CategorynewsComponent } from './news/categorynews/categorynews.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProductsComponent,
    HeaderComponent,
    CategoriesComponent,
    ColorsComponent,
    BrandsComponent,
    SizesComponent,
    SuppliersComponent,
    ImportinvoicesComponent,
    DetailproductsComponent,
    UsersComponent,
    DetailimportvoicesComponent,
    BillofsaleComponent,
    DetailbillofsaleComponent,
    TransportComponent,
    VoucherComponent,
    NewsComponent,
    CategoryvoucherComponent,
    CategorynewsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    NgxPaginationModule,
    CKEditorModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
