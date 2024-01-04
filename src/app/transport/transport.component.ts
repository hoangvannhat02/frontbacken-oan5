import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent {
  tenvanchuyen = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  transports: any;
  gia = 0;
  btn: string = "Thêm mới";
  transport: any = {
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
    this.http.get("http://localhost:8000/admin/transport/data").subscribe((response: any) => {
      this.transports = response;
      console.log(this.transports)
    }, (error) => {
      console.error(error);
    })
  }

  loadnew(){
    this.tenvanchuyen = '';
    this.gia = 0;
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/transport/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.transport.MaVanChuyen = response[0].MaVanChuyen;
        this.transport.TenVanChuyen = response[0].TenVanChuyen;
        this.transport.Gia = response[0].Gia;
      }
      console.log(this.transport)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    let obj: any = {
      TenVanChuyen: this.tenvanchuyen,
      Gia: this.gia
    }
    this.http.post("http://localhost:8000/admin/transport/create", obj).subscribe((response: any) => {
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
    this.http.post("http://localhost:8000/admin/transport/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.transports = response[1];
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
    console.log(this.transport);

    this.http.post("http://localhost:8000/admin/transport/update", this.transport).subscribe((response: any) => {
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
      this.http.delete("http://localhost:8000/admin/transport/delete/" + id).subscribe((response: any) => {
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
