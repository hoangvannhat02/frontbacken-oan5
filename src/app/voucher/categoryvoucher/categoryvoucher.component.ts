import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-categoryvoucher',
  templateUrl: './categoryvoucher.component.html',
  styleUrls: ['./categoryvoucher.component.css']
})
export class CategoryvoucherComponent {
  categoryvoucherobj = {
    LoaiPhieu:"",
    GiaTri:0,
    GiaTriNhoNhat:0,
    GiaTriLonNhat:0
  }
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categoryvouchers: any;
  btn: string = "Thêm mới";
  categoryvoucher: any = {
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
    this.http.get("http://localhost:8000/admin/categoryvoucher/data").subscribe((response: any) => {
      this.categoryvouchers = response;
      console.log(this.categoryvouchers)
    }, (error) => {
      console.error(error);
    })
  }

  loadnew(){
    this.categoryvoucherobj.LoaiPhieu = '';
    this.categoryvoucherobj.GiaTri = 0;
    this.categoryvoucherobj.GiaTriLonNhat = 0;
    this.categoryvoucherobj.GiaTriNhoNhat = 0;
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/categoryvoucher/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.categoryvoucher.MaLoaiPhieu = response[0].MaLoaiPhieu;
        this.categoryvoucher.LoaiPhieu = response[0].LoaiPhieu;
        this.categoryvoucher.GiaTri = response[0].GiaTri;
        this.categoryvoucher.GiaTriNhoNhat = response[0].GiaTriNhoNhat;
        this.categoryvoucher.GiaTriLonNhat = response[0].GiaTriLonNhat;
      }
      console.log(this.categoryvoucher)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
   
    this.http.post("http://localhost:8000/admin/categoryvoucher/create", this.categoryvoucherobj).subscribe((response: any) => {
      console.log(response);
      
      if (response.result) {
        alert(response.message)
        this.loadnew()
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
    this.http.post("http://localhost:8000/admin/categoryvoucher/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.categoryvouchers = response[1];
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
    console.log(this.categoryvoucher);

    this.http.post("http://localhost:8000/admin/categoryvoucher/update", this.categoryvoucher).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/categoryvoucher/delete/" + id).subscribe((response: any) => {
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
