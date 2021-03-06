import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { DataSharingService } from '../data-sharing.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  post_id: any;
  post: any;
  poster: any;
  newComment: any;
  commentors = [];
  isUserLoggedIn: boolean;
  user: any;
  isAdmin: boolean = false;

  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router, private _dataSharingService: DataSharingService) {
    this._dataSharingService.isUserLoggedIn.subscribe( value => { // Subscribe to Login Boolean in DataSharingService
      this.isUserLoggedIn = value;
    })
    
    this._dataSharingService.loggedInUser.subscribe( value => {  // Subscribe to User Data Saved in DataSharingService
      this.user = value;
      if(this.user.level === 'Senior Admin'){
        this.isAdmin = true; // Gives Admin Control of Post if Senior level
      }
    })
   }

  ngOnInit() {
    this.runJquery();
    this.onePostFromService();
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
        this.posterDetails(data['user_id']); // **Post Should Instead Be Attached to Each User**
        this.commentorDetails(this.post);
      })
    })
  }

  // GET DETAILS OF POSTER
  posterDetails(id){
    let observable = this._httpService.getOneUser(id);
    observable.subscribe(data => {
      this.poster = data;
    })
  }

  // GET DETAILS OF COMMENTORS
  commentorDetails(post){
    if(post['comments'] != null){
      for(var x in post['comments']){
        var oneCom = post['comments'][x];
        let observable = this._httpService.getOneUser(oneCom['user_id']);
        observable.subscribe(data => {
          this.commentors.push({user:data});
        })
      }
    }
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

  deleteCommentFromService(commentId){
    let observable = this._httpService.deleteComment(this.post_id,commentId);
    observable.subscribe(data => {
      console.log("Deleted One Comment", data);
      this.onePostFromService();
    })
  }

  runJquery(){
    $(document).ready(function(){

      // Scroll Top Animation
      $('#page_top').children().click(function(){
          $('html, body').animate({scrollTop: $('html').offset().top}, 500)
      });

      // Scroll To Add Comment Animation
      $('#post_subheader').children().click(function(){
        $('html, body').animate({scrollTop: $('#comment').offset().top}, 500)
      });
  
      // Social Link Hover Effects
      var imageSrc;
      $('.social_icon').hover(
          function(){
              imageSrc = $(this).attr('src');
              $(this).attr('src', $(this).attr('hover'))
          },
          function(){
              $(this).attr('src', imageSrc)
          }
      );

      // Submit Comment Form
      $( "#submit_btn" ).click(function() {
        $('#submit_comment').trigger('click');
      });

      // Cancel Comment / Clear Input
      $('#cancel_btn').click(function(){
        var value = $('#comment').val();
        if(value.length > 0 && value != " Write something..."){
          if(window.confirm('All changes made will be lost. Would you like to continue?')){
            $('#comment').val('');
          }
        }
      });
  
    })
  }

}
