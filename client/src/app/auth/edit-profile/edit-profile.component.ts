import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user: any;
  datasaved: boolean = false;
  message: string = "";
  fileToUpload: File = null;
  postImage: string = "../../../assets/Images/showimage.jpeg";
  createForm: FormGroup;
  @ViewChild('Image') myInputVariable: ElementRef;

  constructor(private userservice: UserService, private router: Router, private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUser();
    this.setFormState();
  }

  setFormState():void {
    this.createForm = this.formbuilder.group({
      name: [null, Validators.required],
      imageDummy: [null]
    });
  }

  getUser(){
    this.userservice.getLoggedUser().subscribe(
      data =>{
        // console.log(data);
        // console.log(data.success);
        if (data.success === false) {
          localStorage.removeItem("User");
          this.router.navigate(['login']);
        } else {
          this.user = data.user;
          console.log(this.user);
          this.createForm.controls['name'].setValue(this.user.name);
          this.postImage = "http://localhost:4000/uploads/" + this.user.image;
        }
    });
  }

  postdata() {
    let user = this.createForm.value;
    console.log(user);

    if (this.fileToUpload != null) {
      console.log(this.fileToUpload.name);
      this.userservice.updateProfileImage(this.user._id, this.fileToUpload).subscribe(
        data => {
          this.datasaved = true;
          this.message = data.message;
          // this.fileToUpload = null;
          // this.postImage = "../../../assets/Images/showimage.jpeg";
        }
      );
    }

    this.userservice.updateProfile(user, this.user._id).subscribe(
      data => {
        this.datasaved = true;
        this.message = data.message;
        // this.createForm.reset();
        this.myInputVariable.nativeElement.value = '';
        this.fileToUpload = null;
        // this.postImage = "../../../assets/Images/showimage.jpeg";
        // this.getAllEntries();
      }
    );
  
    setTimeout(() => {
      this.router.navigate(['profile']);
    }, 3000);
    
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    //Show image preview here
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.postImage = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  cancel() {
    this.datasaved = false;
    this.message = '';
    this.createForm.reset();
    this.fileToUpload = null;
    this.postImage = "../../../assets/Images/showimage.jpeg";

    this.router.navigate(['profile']);
  }


}
