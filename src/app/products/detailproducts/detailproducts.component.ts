import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailproducts',
  templateUrl: './detailproducts.component.html',
  styleUrls: ['./detailproducts.component.css'],

})
export class DetailproductsComponent {
  @ViewChild('fileinput') fileInput!: ElementRef;
  imageSrc: any;
  currentimageSrc: any;
  btnimg = "Thêm mới";
  listimg = {
    "MaAnh": "",
    "MaMau": 0,
    "MaChiTietSanPham": 0,
    "DuongDan": ""
  };

  listimgs: any;
  selectedFile: any;
  id: any = 0;
  colors: any;
  sizes: any;
  detailproduct= {
    "MaChiTietSanPham":0,
    "MaSanPham": 0,
    "MaMau": 0,
    "MaKichThuoc": 0,
    "GiaBan": 0,
    "GiaKhuyenMai": 0,
    "SoLuongTon": 0
  };
  detailproducts: any;
  detailproductobj = {
    "MaSanPham": 0,
    "MaMau": 0,
    "MaKichThuoc": 0,
    "GiaBan": 0,
    "GiaKhuyenMai": 0,
    "SoLuongTon": 0
  }

  constructor(private http: HttpClient, private route: ActivatedRoute,private renderer: Renderer2, private el: ElementRef) { };
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getdataid(this.id);
    this.getdatacolors();
    this.getdatasizes();

    this.renderer.listen('document', 'click', (event) => {
      // event.preventDefault();
      const clickedElement = event.target as HTMLElement;
      console.log(clickedElement);
      
      const closestIconMark = clickedElement.closest(".iconclose");
      
      console.log(closestIconMark);
      
      if(closestIconMark){
        const showModel = this.el.nativeElement.querySelectorAll('.showmodel');
        console.log(showModel);
        showModel.forEach((element:any) => {
          this.renderer.setStyle(element, 'display', 'none');
        });
      }
    });
  }

  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }

  reload() {
    this.detailproductobj = {
      "MaSanPham": this.id,
      "MaMau": 0,
      "MaKichThuoc": 0,
      "GiaBan": 0,
      "GiaKhuyenMai": 0,
      "SoLuongTon": 0
    }
  }

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(123);
    
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  loadoneimg(mamau:any,mact:any){
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }

    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      this.listimgs = response   
      console.log(this.listimgs)
    }, (error) => {
      console.error(error);
    })
  }

  editimg(mamau: any, mact: any) {
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }

    console.log(obj);

    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      this.listimg.MaMau = mamau,
      this.listimg.MaChiTietSanPham = mact;
      console.log(response);
      this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
    }, (error) => {
      console.error(error);
    })
  }

  getimgbyid(id: any) {
    this.http.get("http://localhost:8000/admin/product/dataimgbyid/" + id).subscribe((response: any) => {
      this.listimg.MaAnh = response[0].MaAnh;
      this.imageSrc = "http://localhost:8000/" + response[0].DuongDan;
      this.currentimageSrc = response[0].DuongDan;
      this.fileInput.nativeElement.value = '';
      this.btnimg = "Sửa";
      console.log(response)
    }, (error) => {
      console.error(error);
    })
  }

  loadimg(mamau: any, mact: any) {
    const obj = {
      "MaMau": mamau,
      "MaChiTietSanPham": mact
    }
    this.http.post("http://localhost:8000/admin/product/dataimgbymanyid", obj).subscribe((response: any) => {
      // this.listimg = response;
      this.listimgs = response.data;
      if(!response.result){
        console.log(response.message)
      }
    }, (error) => {
      console.error(error);
    })
  }

  destroyimgbyid(id: any, url: any) {
    if (confirm("Bạn có chắc muốn xóa không?")) {
      this.http.delete("http://localhost:8000/admin/product/deleteimg/" + id).subscribe((response: any) => {
        if (response.result) {
          this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + url).subscribe((response: any) => {
          }, (error) => {
            console.error(error);
          })
          alert(response.message)
          this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
        }
        else {
          alert("xóa thất bại")
          console.log(response.message);
        }
      }, (error) => {
        console.error(error);
      })


    }
  }

  updateimg() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
        let path = response.url;
        let param = {
          "MaAnh": this.listimg.MaAnh,
          "MaMau": this.listimg.MaMau,
          "MaChiTietSanPham": this.listimg.MaChiTietSanPham,
          "DuongDan": path
        }
        if (path && this.btnimg === 'Thêm mới') {
          if (this.fileInput.nativeElement.value === '') {
            alert("Bạn chưa chọn tệp cần upload")
          }
          else {
            this.http.post("http://localhost:8000/admin/product/createimg", param).subscribe((response: any) => {
              if (response.result) {
                this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
                this.getdataid(this.id)
                alert("Thêm thành công");
                this.imageSrc = '';
                this.fileInput.nativeElement.value = '';
              }
            }, (error) => {
              console.error(error);
            })
          }
        }

        if (path && this.btnimg === 'Sửa') {
          console.log(this.currentimageSrc);
          if (this.fileInput.nativeElement.value === '') {
            alert("Bạn chưa chọn tệp cần upload")
          }
          else {
            this.http.delete("http://localhost:8000/api/deleteImage?imageName=" + this.currentimageSrc).subscribe((response: any) => {
              if (response.success) {
                this.http.post("http://localhost:8000/admin/product/updateimg", param).subscribe((response: any) => {
                  if (response.result) {

                    this.loadimg(this.listimg.MaMau, this.listimg.MaChiTietSanPham);
                    this.imageSrc = '';
                    this.fileInput.nativeElement.value = '';
                    this.getdataid(this.id)
                    alert("Sửa thành công");
                  }
                }, (error) => {
                  console.error(error);
                })
              }
            }, (error) => {
              console.error(error);
            })
          }
        }
      }, (error) => {
        console.error(error);
      })
    }
    else{
      alert("Bạn chưa chọn tệp cần upload")
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
        let path = response.url;

        console.log(response.url)
        this.imageSrc = "http://localhost:8000/" + path;
      }, (error) => {
        console.error(error);
      })
    }
  }

  getdatacolors() {
    this.http.get("http://localhost:8000/admin/color/data").subscribe((response: any) => {
      this.colors = response;     
    }, (error) => {
      console.error(error);
    })
  }

  getdatasizes() {
    this.http.get("http://localhost:8000/admin/size/data").subscribe((response: any) => {
      this.sizes = response;
    }, (error) => {
      console.error(error);
    })
  }

  getdataid(id: any) {
    this.detailproductobj.MaSanPham = id;
    this.http.get("http://localhost:8000/admin/detailproduct/databyproductid/" + id).subscribe((response: any) => {    
      if (response.result) {
        this.detailproducts = response.data;
      }
    }, (error) => {
      console.error(error);
    })
  }

  getdata() {
    this.http.get("http://localhost:8000/admin/detailproduct/data").subscribe((response: any) => {
      if (response) {
        this.detailproducts = response;
        console.log(this.detailproducts);
      }
    }, (error) => {
      console.error(error);
    })
  }
  create() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post("http://localhost:8000/upload", formData).subscribe((response: any) => {
        let path = response.url;
        this.imageSrc = "http://localhost:8000/" + path;
      }, (error) => {
        console.error(error);
      })
    }
    this.http.post("http://localhost:8000/admin/detailproduct/create", this.detailproductobj).subscribe((response: any) => {
      if (response.result) {
        this.getdataid(this.detailproductobj.MaSanPham);
        alert(response.message)
        this.reload();
      }
      else {
        alert("thêm thất bại")
      }
    }, (error) => {
      console.error(error);
    })
  }

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/detailproduct/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
          this.getdata();
        }
        else {
          alert("xóa thất bại")
          console.log(response.message);
        }
      }, (error) => {
        console.error(error);
      })
    }
  }

  edit(id:any){
    this.http.get("http://localhost:8000/admin/detailproduct/databyid/" + id).subscribe((response: any) => {
        if (response.result) {
          this.detailproduct.MaChiTietSanPham = response.data[0].MaChiTietSanPham;
          this.detailproduct.MaSanPham = response.data[0].MaSanPham;
          this.detailproduct.MaMau = response.data[0].MaMau;
          this.detailproduct.MaKichThuoc = response.data[0].MaKichThuoc;
          this.detailproduct.GiaBan = response.data[0].GiaBan;
          this.detailproduct.GiaKhuyenMai = response.data[0].GiaKhuyenMai;
          this.detailproduct.SoLuongTon = response.data[0].SoLuongTon;
          console.log(this.detailproduct);
        }
        else {
          console.log(response.message);
        }
      }, (error) => {
        console.error(error);
      })
  }

  update(){
    this.http.post("http://localhost:8000/admin/detailproduct/update", this.detailproduct).subscribe((response: any) => {
      if (response.result) {
        alert(response.message)
        this.getdataid(this.id);
      }
      else {
        alert("sửa thất bại")
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }

}
