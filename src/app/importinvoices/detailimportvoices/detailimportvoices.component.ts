import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailimportvoices',
  templateUrl: './detailimportvoices.component.html',
  styleUrls: ['./detailimportvoices.component.css']
})
export class DetailimportvoicesComponent {
  id: any;
  searchkeyword: any;
  detailimportinvoices: any;
  detailimportinvoice: any = {
    MaHoaDonNhap: 0,
    MaChiTietSanPham: 0,
    GiaNhap: 0,
    SoLuong: 0
  };
  detailimportinvoiceobj: any = {
    MaChiTietHoaDonNhap: 0,
    MaHoaDonNhap: 0,
    MaChiTietSanPham: 0,
    GiaNhap: 0,
    SoLuong: 0
  };
  products: any;

  constructor(private http: HttpClient, private datePiPe: DatePipe, private route: ActivatedRoute,private renderer: Renderer2, private el: ElementRef) { };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.detailimportinvoice.MaHoaDonNhap = this.id;
    this.getdata();
    this.getdataproducts();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/dataid/" + id).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.detailimportinvoiceobj.MaHoaDonNhap = response[0].MaHoaDonNhap;
        this.detailimportinvoiceobj.MaChiTietSanPham = response[0].MaChiTietSanPham;
        this.detailimportinvoiceobj.MaChiTietHoaDonNhap = response[0].MaChiTietHoadonNhap;
        this.detailimportinvoiceobj.GiaNhap = response[0].GiaNhap;
        this.detailimportinvoiceobj.SoLuong = response[0].SoLuong;
      }
    }, (error) => {
      console.error(error);
    })
  }

  add() {
    let isMatch = this.detailimportinvoices.find((data: any) => {
      return data.MaChiTietSanPham.toString() === this.detailimportinvoice.MaChiTietSanPham.toString();
    });
    if (isMatch) {
      alert("Thông tin sản phẩm đã có trong đây vui lòng xem lại và chỉ cần cập nhật lại số lượng")
    }
    else {
      this.http.post("http://localhost:8000/admin/detailimportinvoice/create", this.detailimportinvoice).subscribe((response: any) => {
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
  }


  getdata() {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/databyid/" + this.id).subscribe((response: any) => {
      if (response) {
        this.detailimportinvoices = response;
        console.log(response);
      }
      else
      {
        this.detailimportinvoices = []
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.detailimportinvoice.MaChiTietSanPham = 0
    this.detailimportinvoice.GiaNhap = 0
    this.detailimportinvoice.SoLuong = 0
  }

  edit() {
    this.http.post("http://localhost:8000/admin/detailimportinvoice/update", this.detailimportinvoiceobj).subscribe((response: any) => {
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
      this.http.delete("http://localhost:8000/admin/detailimportinvoice/delete/" + id).subscribe((response: any) => {
        console.log(response);

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
  getdataproducts() {
    this.http.get("http://localhost:8000/admin/detailproduct/data").subscribe((response: any) => {
      this.products = response;
      console.log(this.products);
    }, (error) => {
      console.error(error);
    })
  }


  redirettodetail(id: any) {
    this.http.get("http://localhost:8000/admin/detailimportinvoice/databyid/" + id).subscribe((response: any) => {
      console.log(response);
    }, (error) => {
      console.error(error);
    })
  }
}
