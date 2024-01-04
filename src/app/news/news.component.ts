import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CkeditorService } from '../myservice/ckeditor.service';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  @ViewChild('fileinputedit') fileInputedit!: ElementRef;
  @ViewChild('fileinput') fileInput!: ElementRef;

  public Editor = Editor;
  ckeditorcontent:any;
  currentImg: any;
  selectedFile: any;
  selectedFileedit:any;
  imageSrc: any;
  categorynews: any;
  users: any;
  newobj: any = {
    MaTin: 0,
    TieuDe: "",
    MaChuDeTinTuc: 0,
    NgayTao: "",
    NoiDung: "",
    Anh: "",
    MaNguoiDung: 0,
    TrangThai: 1
  }
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  imageEditSrc:any;
  totalPages = 0;
  news: any;
  btn: string = "Thêm mới";
  new: any = {
  };

  constructor(
    private http: HttpClient, 
    private datePiPe: DatePipe,
    private renderer: Renderer2, 
    private el: ElementRef,
    private ckeditor:CkeditorService
    ) { };

  ngOnInit(): void {
    this.search();
    this.getdatausers();
    this.getdatacategorynews();
    
  }

  updateInputValue(){

  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  loadnew() {
    this.newobj.MaTin = 0,
    this.newobj.TieuDe= "",
    this.newobj.MaChuDeTinTuc= 0,
    this.newobj.NgayTao= "",
    this.newobj.NoiDung= "",
    this.newobj.Anh= "",
    this.newobj.MaNguoiDung= 0,
    this.newobj.TrangThai= 1
    this.imageSrc = "";
    this.fileInput.nativeElement.value = "";
    this.newobj.TrangThai = undefined;
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/news/data").subscribe((response: any) => {
      this.news = response;
      console.log(this.news)
    }, (error) => {
      console.error(error);
    })
  }

  getdatausers() {
    this.http.get("http://localhost:8000/admin/user/data").subscribe((response: any) => {
      this.users = response;
      console.log(this.users)
    }, (error) => {
      console.error(error);
    })
  }

  getdatacategorynews() {
    this.http.get("http://localhost:8000/admin/categorynews/data").subscribe((response: any) => {
      this.categorynews = response;
      console.log(this.categorynews)
    }, (error) => {
      console.error(error);
    })
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/news/databyid/" + id).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.new.MaTin = response[0].MaTin;
        this.new.TieuDe = response[0].TieuDe;
        this.new.MaChuDeTinTuc = response[0].MaChuDeTintuc;
        const formattedDate = this.datePiPe.transform(new Date(response[0].NgayTao), 'yyyy-MM-dd');
        this.new.NgayTao = formattedDate;
        this.new.NoiDung = response[0].NoiDung;
        this.new.Anh = response[0].Anh;
        this.new.MaNguoiDung = response[0].MaNguoiDung;
        this.new.TrangThai = response[0].TrangThai.data[0];
        this.imageEditSrc = 'http://localhost:8000/' + this.new.Anh;
        this.currentImg = this.new.Anh;
      }
      console.log(this.new)
    }, (error) => {
      console.error(error);

    })
  }

  add() {
    const formattedDate = this.datePiPe.transform(new Date(this.newobj.NgayTao), 'yyyy-MM-dd');
    this.newobj.NgayTao = formattedDate;
    console.log(this.newobj);
    
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('newImage', this.selectedFile);
      this.http.post("http://localhost:8000/admin/news/uploadfile", formData).subscribe((response: any) => {
        let path = response.url;
        this.newobj.Anh = path;
        if (path) {
          console.log(this.newobj);
          this.http.post("http://localhost:8000/admin/news/create", this.newobj).subscribe((response: any) => {
            console.log(response);
            
            if (response.result) {
              alert(response.message)
              this.fileInput.nativeElement.value = "";
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
      }, (error) => {
        console.error(error);
      })
    }
    else {
      console.log(this.newobj);
      
      this.http.post("http://localhost:8000/admin/news/create", this.newobj).subscribe((response: any) => {
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
  }

  search() {
    this.http.post("http://localhost:8000/admin/news/search", this.filterobj).subscribe((response: any) => {
      if (response) {
        this.totalPages = Math.ceil(response[0][0].totalperpages / this.filterobj.itemsperpage);
        this.news = response[1];
        console.log(response);
      }
    }, (error) => {
      console.error(error);
    })
  }

  onPrevious(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber--;
    this.search();
  }

  onNext(event: Event) {
    event.preventDefault();
    this.filterobj.pagenumber++;
    this.search();
  }

  edit() {
    const formattedDate = this.datePiPe.transform(new Date(this.new.NgayTao), 'yyyy-MM-dd');
    this.new.NgayTao = formattedDate;
    if (this.selectedFileedit) {
      const formData = new FormData();
      formData.append('newImage', this.selectedFileedit);
      this.http.post("http://localhost:8000/admin/news/uploadfile", formData).subscribe((response: any) => {
        let path = response.url;
        this.new.Anh = path;
        console.log(this.new);
        if (path) {
          this.http.post("http://localhost:8000/admin/news/update", this.new).subscribe((response: any) => {
            console.log(response);
            if (response.result) {
              this.http.delete("http://localhost:8000/admin/news/deleteimg?imageName=" + this.currentImg).subscribe((response: any) => { }
                , (error) => {
                  console.error(error)
                })

              alert(response.message)
              this.fileInputedit.nativeElement.value = "";
              this.search();
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
      this.http.post("http://localhost:8000/admin/news/update", this.new).subscribe((response: any) => {
        console.log(response);
        
        if (response.result) {
          this.http.delete("http://localhost:8000/admin/news/deleteimg?imageName=" + this.currentImg).subscribe((response: any) => { }
            , (error) => {
              console.error(error)
            })
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
  }

  delete(id: any,urlimg:any) {
    if (confirm("Bạn có muốn xóa tin tức này không?")) {
      this.http.delete("http://localhost:8000/admin/news/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          this.http.delete("http://localhost:8000/admin/news/deleteimg?imageName=" + urlimg).subscribe((response: any) => { }
            , (error) => {
              console.error(error)
            })
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

  upfileedit(event: any) {
    this.selectedFileedit = event.target.files[0];
    if (this.selectedFileedit) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageEditSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFileedit);
    }
  }
}
