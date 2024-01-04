import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent{

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
  users: any;
  user: any = {
    HoTen: "",
    NgaySinh: Date.now(),
    DiaChi: "",
    TrangThai: 1,
    Email: "",
    DienThoai: "",
    Quyen: "",
    Anh: ""
  };
  userobj: any = {
    MaNguoiDung: "",
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    TrangThai: 1,
    Email: "",
    DienThoai: "",
    Quyen: "",
    Anh: ""
  };

  constructor(private http: HttpClient, private datePiPe: DatePipe,private renderer: Renderer2, private el: ElementRef) {
   };

  ngOnInit(): void {
    this.getdata();
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/user/databyid/" + id).subscribe((response: any) => {
      if (response) {
        this.userobj.MaNguoiDung = response[0].MaNguoiDung;
        this.userobj.HoTen = response[0].HoTen;
        const formattedDate = this.datePiPe.transform(new Date(response[0].NgaySinh), 'yyyy-MM-dd');
        this.userobj.NgaySinh = formattedDate;
        this.userobj.DiaChi = response[0].DiaChi;
        this.userobj.Email = response[0].Email;
        this.userobj.DienThoai = response[0].DienThoai;
        this.userobj.TrangThai = response[0].TrangThai.data[0];
        this.userobj.Quyen = response[0].Quyen;
        this.userobj.PassWord = response[0].PassWord;
        this.userobj.Anh = response[0].Anh;
        this.imageEditSrc = 'http://localhost:8000/' + this.userobj.Anh;
        this.currentImg = this.userobj.Anh;
      }

    }, (error) => {
      console.error(error);
    })
  }

  add() {
    const formattedDate = this.datePiPe.transform(new Date(this.user.NgaySinh), 'yyyy-MM-dd');
    this.user.NgaySinh = formattedDate;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('userImage', this.selectedFile);
      this.http.post("http://localhost:8000/admin/user/uploadfile", formData).subscribe((response: any) => {
        let path = response.url;
        this.user.Anh = path;
        if (path) {
          this.http.post("http://localhost:8000/admin/user/create", this.user).subscribe((response: any) => {
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
      }, (error) => {
        console.error(error);
      })
    }
    else {
      this.http.post("http://localhost:8000/admin/user/create", this.user).subscribe((response: any) => {
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
    this.http.post("http://localhost:8000/admin/user/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.users = response[1];
        console.log(response);
        console.log(response[0][0].totalperpages);
      }
    }, (error) => {
      console.error(error);
    })
  }

  loadNew() {
    this.user = {};
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
    const formattedDate = this.datePiPe.transform(new Date(this.userobj.NgaySinh), 'yyyy-MM-dd');
    this.userobj.NgaySinh = formattedDate;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('userImage', this.selectedFile);
      this.http.post("http://localhost:8000/admin/user/uploadfile", formData).subscribe((response: any) => {
        let path = response.url;
        this.userobj.Anh = path;
        if (path) {
          this.http.post("http://localhost:8000/admin/user/update", this.userobj).subscribe((response: any) => {
            if (response.result) {
              this.http.delete("http://localhost:8000/admin/user/deleteimg?imageName=" + this.currentImg).subscribe((response: any) => { }
                , (error) => {
                  console.error(error)
                })
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
      }, (error) => {
        console.error(error);
      })
    }
    else {
      this.http.post("http://localhost:8000/admin/user/update", this.userobj).subscribe((response: any) => {
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

  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/user/delete/" + id).subscribe((response: any) => {
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

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upfileuser(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageEditSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
