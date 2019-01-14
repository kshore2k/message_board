import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { DataSharingService } from '../data-sharing.service';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  post_id: any;
  post: any;
  newComment: any;
  isUserLoggedIn: boolean;
  user: any;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router, private _dataSharingService: DataSharingService) {
    this._dataSharingService.isUserLoggedIn.subscribe( value => { // Subscribe to Login Boolean in DataSharingService
      this.isUserLoggedIn = value;
    })
    
    this._dataSharingService.loggedInUser.subscribe( value => {  // Subscribe to User Data Saved in DataSharingService
      this.user = value;
    })
   }

  ngOnInit() {
    this.onePostFromService();
    // this.getAuth();
    this.newComment = {comment: ""};
  }

  onePostFromService(){
    this._route.params.subscribe(params => {
      console.log(`Post id: ${params.id}`);
      this.post_id = params.id;
      let observable = this._httpService.getOnePost(this.post_id);
      observable.subscribe(data => {
        console.log("Getting One Post");
        this.post = data;
      })
    })
  }

  addComment(id){
    let observable = this._httpService.addCommentToPost(id,this.newComment);
    observable.subscribe(data => {
      console.log(`Comment Added To Post id: ${this.post_id}`);
      this.onePostFromService();
      this.newComment = {comment: ""};
    })
  }

  deletePostFromService(id){
    let observable = this._httpService.deletePost(id);
    observable.subscribe(data => {
      console.log("Deleted One Post", data);
      this._router.navigate(['/dashboard']);

    })
  }

  // getAuth(){
  //   let observable = this._httpService.authenticate();
  //   observable.subscribe(data => {
  //     console.log("Getting Authentication", data);
  //     if(data['msg']==="True"){
  //       this.username = data['username'];
  //     }
  //   })
  // }

}
