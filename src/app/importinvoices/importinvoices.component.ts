import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-importinvoices',
  templateUrl: './importinvoices.component.html',
  styleUrls: ['./importinvoices.component.css']
})
export class ImportinvoicesComponent {
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  importinvoices: any;
  importinvoice: any = {
    MaNhaCungCap: 0,
    MaNguoiDung: 0,
    NgayNhap: ""
   
  };
  importinvoiceobj: any = {
    MaHoaDonNhap:0,
    MaNhaCungCap: 0,
    MaNguoiDung: 0,
    NgayNhap: ""
  };
  users:any;
  suppliers:any;

  constructor(private http: HttpClient, private datePiPe: DatePipe, private router:Router,private renderer: Renderer2, private el: ElementRef) { };

  ngOnInit(): void {
    this.getdata();
    this.getdatasuppliers();
    this.getdatausers();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/importinvoice/databyid/" + id).subscribe((response: any) => {
      console.log(response);
      
      if (response) {
        this.importinvoiceobj.MaHoaDonNhap = response[0].MaHoaDonNhap;
        this.importinvoiceobj.MaNguoiDung = response[0].MaNguoiDung;
        this.importinvoiceobj.MaNhaCungCap = response[0].MaNhaCungCap;
        const formattedDate = this.datePiPe.transform(new Date(response[0].NgayNhap), 'yyyy-MM-dd');
        this.importinvoiceobj.NgayNhap = formattedDate;
      
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    const formattedDate = this.datePiPe.transform(new Date(this.importinvoice.NgayNhap), 'yyyy-MM-dd');
    this.importinvoice.NgayNhap = formattedDate;
    this.http.post("http://localhost:8000/admin/importinvoice/create", this.importinvoice).subscribe((response: any) => {
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
    this.http.post("http://localhost:8000/admin/importinvoice/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.importinvoices = response[1];
        console.log(response);
        console.log(response[0][0].totalperpages);
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.importinvoice = {};
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
    const formattedDate = this.datePiPe.transform(new Date(this.importinvoiceobj.NgayNhap), 'yyyy-MM-dd');
    this.importinvoiceobj.NgayNhap = formattedDate;
    console.log(this.importinvoiceobj);
    
    this.http.post("http://localhost:8000/admin/importinvoice/update", this.importinvoiceobj).subscribe((response: any) => {
      console.log(response);
      
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
      this.http.delete("http://localhost:8000/admin/importinvoice/delete/" + id).subscribe((response: any) => {
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
  getdatausers() {
    this.http.get("http://localhost:8000/admin/user/data").subscribe((response: any) => {
      this.users = response;     
    }, (error) => {
      console.error(error);
    })
  }
  getdatasuppliers() {
    this.http.get("http://localhost:8000/admin/supplier/data").subscribe((response: any) => {
      this.suppliers = response;     
    }, (error) => {
      console.error(error);
    })
  }

  redirettodetail(id:any){
    this.router.navigate(['detailimportinvoice/'+id])   
  }
}
