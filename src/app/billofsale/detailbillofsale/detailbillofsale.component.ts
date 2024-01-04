import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailbillofsale',
  templateUrl: './detailbillofsale.component.html',
  styleUrls: ['./detailbillofsale.component.css']
})
export class DetailbillofsaleComponent {
  id:any
  discouttotal = 0
  filterobj = {
    "searchkeyword": "",
    "pagenumber": 1,
    "itemsperpage": 5
  }
  allquantity = 0;
  totalPages = 0;
  getsummoney = 0;
  detailbills:any[]=[];
  mota = "";
  btn: string = "Thêm mới";
  

  constructor(
    private http: HttpClient,
    private route:ActivatedRoute,
    private router:Router
    ) 
    { };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.getdatabyid(this.id)
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/admin/detailbillofsale/datainfoproductbyid/" + id).subscribe((response: any) => {
      if (response) {
        this.detailbills = response
        console.log(this.detailbills);
        
        this.allquantity = this.detailbills.reduce((sum,value) => sum + value.SoLuong,0);
        this.getsummoney = this.detailbills.reduce((sum,value) => sum+(value.SoLuong*value.GiaKhuyenMai),0);

        switch(this.detailbills[0].LoaiPhieu){
          case "Phần trăm":
            this.discouttotal += this.getsummoney * this.detailbills[0].GiaTri / 100;
            break;
          case "VND":
            this.discouttotal += this.detailbills[0].GiaTri;
            break
        }
      }
      console.log(this.detailbills)
    }, (error) => {
      console.error(error);

    })
  }

 
  update() {
    if(!(this.detailbills[0].TrangThai === 2)){
      let params = {
        MaHoaDon: this.detailbills[0].MaHoaDon,
        TrangThai: this.detailbills[0].TrangThai += 1
      }
      console.log(params);
      
      this.http.post("http://localhost:8000/admin/billofsale/update",params).subscribe((response: any) => {
          if (response.result) {
            alert(response.message) 
            this.router.navigate(['/billofsale']);
          }
          else {
            alert("Duyệt thất bại")
          }
        }, (error) => {
          console.error(error);
        })
    }
    
  }

  

  delete(id: any) {
    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
      this.http.delete("http://localhost:8000/admin/billofsale/delete/" + id).subscribe((response: any) => {
        if (response.result) {
          alert(response.message)
         
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
