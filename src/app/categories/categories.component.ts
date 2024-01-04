import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  tenloai = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categories: any;
  mota = "";
  btn: string = "Thêm mới";
  category: any = {

  };

  constructor(private http: HttpClient,private renderer: Renderer2, private el: ElementRef) { };

  ngOnInit(): void {
    this.search();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/category/data").subscribe((response: any) => {
      this.categories = response;
      console.log(this.categories)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/category/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.category.MaLoai = response[0].MaLoai;
        this.category.TenLoai = response[0].TenLoai;
        this.category.MoTa = response[0].MoTa;
      }
      console.log(this.category)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    let obj: any = {
      TenLoai: this.tenloai,
      MoTa: this.mota
    }
    this.http.post("http://localhost:8000/admin/category/create", obj).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.getdata();
      }
      else {
        alert("thêm thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  search() {
    this.http.post("http://localhost:8000/admin/category/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.categories = response[1];
        console.log(response[0][0].totalperpages);
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

  edit() {
    console.log(this.category);

    this.http.post("http://localhost:8000/admin/category/update", this.category).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.getdata();
      }
      else {
        alert("sửa thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/category/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.getdata();
        }
        else {
          alert("xóa thất bại")
        }
      }, (error) => {
        console.error(error);
      })
    }
  }
}
