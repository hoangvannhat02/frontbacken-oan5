import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent {
  currentImg: any;
  selectedFile: any;
  imageSrc: any;
  imageEditSrc: any;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  suppliers: any;
  supplier: any = {
    HoTen: "",
    DiaChi: "",
    Email: "",
    DienThoai: ""
  };
  supplierobj: any = {
    MaNhaCungCap: "",
    HoTen: "",
    DiaChi: "",
    Email: "",
    DienThoai: ""
  };

  constructor(private http: HttpClient, private datePiPe: DatePipe, private router:Router,private renderer: Renderer2, private el: ElementRef) { };

  ngOnInit(): void {
    this.getdata();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/supplier/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.supplierobj.MaNhaCungCap = response[0].MaNhaCungCap;
        this.supplierobj.HoTen = response[0].HoTen;
        this.supplierobj.DiaChi = response[0].DiaChi;
        this.supplierobj.Email = response[0].Email;
        this.supplierobj.DienThoai = response[0].DienThoai;
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    console.log(this.supplier);
    
    this.http.post("http://localhost:8000/admin/supplier/create", this.supplier).subscribe((response: any) => {
      if (response.result) {
        this.getdata();
        this.loadNew();
        alert(response.message)
      }
      else {
        console.log(response.message);
        alert("thêm thất bại")
      }
    }, (error) => {
      console.error(error);

    })
  }


  getdata() {
    this.http.post("http://localhost:8000/admin/supplier/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.suppliers = response[1];
        console.log(response);
        console.log(response[0][0].totalperpages);
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.supplier = {};
  }

  onPrevious(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber--;
    this.getdata();
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.getdata();
  }

  edit() {
    this.http.post("http://localhost:8000/admin/supplier/update", this.supplierobj).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa thông tin này không?")) {
      this.http.delete("http://localhost:8000/admin/supplier/delete/" + id).subscribe((response: any) => {
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
