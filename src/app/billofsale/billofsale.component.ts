import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billofsale',
  templateUrl: './billofsale.component.html',
  styleUrls: ['./billofsale.component.css']
})
export class BillofsaleComponent {
  tenloai = '';

  status=0;
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5,
    "status":0
  }
  totalPages = 0;
  bills: any;
  mota = "";
  btn: string = "Thêm mới";
  category: any = {
  };

  constructor(
    private http: HttpClient,
    private renderer: Renderer2, 
    private el: ElementRef,
    private router:Router
    ) 
    { };

  ngOnInit(): void {
    this.search();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/billofsale/data").subscribe((response: any) => {
      this.bills = this.bills;
      console.log(this.bills)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/billofsale/databyid/" + id).subscribe((response: any) => {
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
      
    }
    this.http.post("http://localhost:8000/admin/billofsale/create", obj).subscribe((response: any) => {
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
    this.http.post("http://localhost:8000/admin/billofsale/search", this.filterobj).subscribe((response: any) => {   
      console.log(response);
         
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.bills = response[1];
        console.log(response[0][0].totalperpages);
      }
    }, (error) => {
      console.error(error);
    })
  }

  changene(){
    this.filterobj.status = this.status
    this.search()
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
    this.http.post("http://localhost:8000/admin/billofsale/update", this.category).subscribe((response: any) => {
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

  redirettodetail(id:any){
    this.router.navigate(['/detailbillofsale/',id])
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/billofsale/delete/" + id).subscribe((response: any) => {
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
