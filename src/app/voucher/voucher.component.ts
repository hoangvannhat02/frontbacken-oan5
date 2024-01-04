import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent {
  voucherobj:any = {
    MaPhieu:"",
    TenPhieu:"",
    MaLoaiPhieu:0,
    SoLuong:0,
    SoLuongDaDung:0,
    NgayBatDau:"",
    NgayKetThuc:""
  }
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  categoryvouchers:any;
  totalPages = 0;
  vouchers: any;
  btn: string = "Thêm mới";
  voucher: any = {
  };

  constructor(private http: HttpClient, private datePiPe: DatePipe,private renderer: Renderer2, private el: ElementRef) { };

  ngOnInit(): void {
    this.search();
    this.getdata();
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/categoryvoucher/data").subscribe((response: any) => {
      this.categoryvouchers = response;
      console.log(response)
    }, (error) => {
      console.error(error);
    })
  }

  loadnew(){
    this.voucherobj.TenPhieu = '';
    this.voucherobj.MaLoaiPhieu = 0;
    this.voucherobj.SoLuong = 0;
    this.voucherobj.SoLuongDaDung = 0;
    this.voucherobj.NgayBatDau = "";
    this.voucherobj.NgayKetThuc = '';
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/voucher/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.voucher.MaPhieu = response[0].MaPhieu;
        this.voucher.TenPhieu = response[0].TenPhieu;
        this.voucher.SoLuong = response[0].SoLuong;
        this.voucher.MaLoaiPhieu = response[0].MaLoaiPhieu;
        this.voucher.SoLuongDaDung = response[0].SoLuongDaDung;
        const formattedDateStart = this.datePiPe.transform(new Date(response[0].NgayBatDau), 'yyyy-MM-dd');
        const formattedDateEnd = this.datePiPe.transform(new Date(response[0].NgayKetThuc), 'yyyy-MM-dd');
        this.voucher.NgayBatDau = formattedDateStart;
        this.voucher.NgayKetThuc = formattedDateEnd;
      }
      console.log(this.voucher)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    const formattedDateStart = this.datePiPe.transform(new Date(this.voucherobj.NgayBatDau), 'yyyy-MM-dd');
    const formattedDateEnd = this.datePiPe.transform(new Date(this.voucherobj.NgayKetThuc), 'yyyy-MM-dd');
    this.voucherobj.NgayBatDau = formattedDateStart;
    this.voucherobj.NgayKetThuc = formattedDateEnd;
    this.http.post("http://localhost:8000/admin/voucher/create", this.voucherobj).subscribe((response: any) => {
      console.log(response);
      
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

  search() {
    this.http.post("http://localhost:8000/admin/voucher/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.vouchers = response[1];
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
  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  onNext(event:Event){
    event.preventDefault();
    this.filterobj.pagenumber ++;
    this.search();
  }

  edit() {
    const formattedDateStart = this.datePiPe.transform(new Date(this.voucher.NgayBatDau), 'yyyy-MM-dd');
    const formattedDateEnd = this.datePiPe.transform(new Date(this.voucher.NgayKetThuc), 'yyyy-MM-dd');
    this.voucher.NgayBatDau = formattedDateStart;
    this.voucher.NgayKetThuc = formattedDateEnd;

    this.http.post("http://localhost:8000/admin/voucher/update", this.voucher).subscribe((response: any) => {
      console.log(response);
      
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
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/voucher/delete/" + id).subscribe((response: any) => {
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
