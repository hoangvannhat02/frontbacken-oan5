import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-categorynews',
  templateUrl: './categorynews.component.html',
  styleUrls: ['./categorynews.component.css']
})
export class CategorynewsComponent {
  tenchude = '';
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  totalPages = 0;
  categorynews: any;
  btn: string = "Thêm mới";
  categorynew: any = {
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
    this.http.get("http://localhost:8000/admin/categorynews/data").subscribe((response: any) => {
      this.categorynews = response;
      console.log(this.categorynews)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/categorynews/databyid/" + id).subscribe((response: any) => {
      console.log(response);
      
      if (response) {
        this.categorynew.MaChuDeTinTuc = response[0].MaChuDeTintuc;
        this.categorynew.TenChuDe = response[0].TenChuDe;      
      }
      console.log(this.categorynew)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    let obj: any = {
      TenChuDe: this.tenchude   
    }
    this.http.post("http://localhost:8000/admin/categorynews/create", obj).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.tenchude = '';
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
    this.http.post("http://localhost:8000/admin/categorynews/search", this.filterobj).subscribe((response: any) => {      
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.categorynews = response[1];
        console.log(response);
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
    this.http.post("http://localhost:8000/admin/categorynews/update", this.categorynew).subscribe((response: any) => {
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
    if (confirm("Bạn có muốn xóa chủ đề này không?")) {
      this.http.delete("http://localhost:8000/admin/categorynews/delete/" + id).subscribe((response: any) => {
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
