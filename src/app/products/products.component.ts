import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent {
  totalPages:number = 0;
  productobj = {
    "MaSanPham":0,
    "TenSanPham":"",
    "MaLoai":0,
    "MaHang":0,
    "LuotXem":0,
    "TrangThai":1,
    "MoTaNgan":"",
    "MoTa":"" 
  }
  loaisanpham:any;
  hang:any;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  categories:any;
  brands:any;
  products:any;
  product: any = {
    "MaSanPham":0,
    "TenSanPham":"",
    "MaLoai":0,
    "MaHang":0,
    "LuotXem":0,
    "TrangThai":1,
    "MoTaNgan": "",
    "MoTa": ""
  };
  constructor(private http: HttpClient,private route:Router,private renderer: Renderer2, private el: ElementRef){};
  ngOnInit(): void {    
    this.search();
    this.getdatacate();
    this.getdatabrand();
  }

  loadnew(){
    this.productobj.MaSanPham = 0,
    this.productobj.TenSanPham = "",
    this.productobj.MaLoai = 0,
    this.productobj.MaHang = 0,
    this.productobj.LuotXem = 0,
    this.productobj.TrangThai = 1,
    this.productobj.MoTaNgan = "",
    this.productobj.MoTa = "" 
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatacate() {
    this.http.get("http://localhost:8000/admin/category/data").subscribe((response: any) => {
      this.categories = response;
      console.log(this.categories)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabrand() {
    this.http.get("http://localhost:8000/admin/brand/data").subscribe((response: any) => {
      this.brands = response;
      console.log(this.brands)
    }, (error) => {
      console.error(error);
    })
  }

  search() {
    this.http.post("http://localhost:8000/admin/product/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.products = response[1];
        console.log(this.products);
      }
    }, (error) => {
      console.error(error);
    })
  }
  
  onPrevious(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber --;
    this.search();
  }

  onNext(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber ++;
    this.search();
  }

  create() {
    this.http.post("http://localhost:8000/admin/product/create",this.productobj).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.loadnew();
        this.search();
      }
      else {
        alert("thêm thất bại")
      }
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id:any){
    this.http.get("http://localhost:8000/admin/product/databyid/"+id).subscribe((response:any)=>{
      console.log(response);
      
      if (response) {
        this.product.MaSanPham = response[0].MaSanPham;
        this.product.TenSanPham = response[0].TenSanPham;
        this.product.MaLoai = response[0].MaLoai;
        this.product.MaHang = response[0].MaHang;
        this.product.LuotXem = response[0].LuotXem;
        this.product.TrangThai = response[0].TrangThai.data[0];
        this.product.MoTaNgan = response[0].MoTaNgan;
        this.product.MoTa = response[0].MoTa;
      }
      
    },(error)=>{
        console.log(error)
    })
  }

  edit() {
    this.http.post("http://localhost:8000/admin/product/update", this.product).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.search();
      }
      else {
        alert("sửa thất bại")
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }
  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/product/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.search();
        }
        else {
          alert("xóa thất bại")
          console.log(response.message);  
        }
      }, (error) => {
        console.error(error);
      })
    }
  }

  redirettodetail(id:any){
    this.route.navigate(['products/detailproducts/'+id]);
  }
}
