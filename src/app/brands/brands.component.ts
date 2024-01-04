import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {
  tenhang = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  brands: any;
  mota = "";
  btn: string = "Thêm mới";
  brand: any = {

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
    this.http.get("http://localhost:8000/admin/brand/data").subscribe((response: any) => {
      this.brands = response;
      console.log(this.brands)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/brand/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.brand.MaHang = response[0].MaHang;
        this.brand.TenHang = response[0].TenHang;
        this.brand.MoTa = response[0].MoTa;
      }
      console.log(this.brand)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    let obj: any = {
      TenHang: this.tenhang,
      MoTa: this.mota
    }
    this.http.post("http://localhost:8000/admin/brand/create", obj).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.search();
      }
      else {
        alert("thêm thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  search() {
    this.http.post("http://localhost:8000/admin/brand/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.brands = response[1];
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
    this.http.post("http://localhost:8000/admin/brand/update", this.brand).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.search();
      }
      else {
        alert("sửa thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa hãng này không?")) {
      this.http.delete("http://localhost:8000/admin/brand/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.search();
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
