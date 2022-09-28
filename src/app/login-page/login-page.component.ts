import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../services/email.service';
import { SuucessDialogComponent } from '../suucess-dialog/suucess-dialog.component';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

// ViewEncapsulation.None - the style gets moved to the DOM head section and is not scoped to the component.
export class LoginPageComponent implements OnInit {

  loginForm: any; 
  selectedFiles: any;
  previews: string[] = [];
  limitMessage: string = '';
  numberExceeded: boolean = false;

  constructor(
    private fb: FormBuilder, 
    public emailService: EmailService, 
    public dialog: MatDialog, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      description: ['',[Validators.required]],
      emailaddress: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      file: new FormControl(''),
    });
  }
//  to add  images
  selectFiles(event: any): void {
    // if loginform is valid image will be added
    if (this.loginForm.valid) {
      /* 
      this.selectedFiles will have the file selected
      and will be pushed to the this.previews array 
      and displayed in web page
      If more than 2 image is uploaded error will be shown
      */
      this.selectedFiles = event.target.files;
      if (this.selectedFiles && this.selectedFiles[0]) {
        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (this.previews.length >= 2) {
              this.numberExceeded = true;
              this.limitMessage = "Can upload max of 2 images";
            } else {
              this.previews.push(e.target.result);
            }
          };
          reader.readAsDataURL(this.selectedFiles[i]);
        }
      }
    }

  }

  // on click of button save
  save() {
    /** spinner starts */
    this.spinner.show();
    if (this.loginForm.valid) {
      this.sendMail();
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
        this.openDialog()
      }, 5000);
    }
  }
  
// method to show dialog with success info
  openDialog() {
    const dialogRef = this.dialog.open(SuucessDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
      console.log(`Dialog result: ${result}`);
    });
  }

  // to sendMail
  sendMail() {
    // storing the formvalues in formValues
    let formValues = {
      firstname: this.loginForm.value.firstName,
      lastName: this.loginForm.value.lastName,
      emailAddress: this.loginForm.value.emailaddress
    }
    // passing it to the reqObj as obj
    let reqObj = {
      email: formValues
    }
    // to access method in emailService
    this.emailService.sendMessage(reqObj).subscribe((data: any) => {
      console.log(data);
    })
  }

// get accessor
  // get f() { return this.loginForm.controls; }

  // reset form on submit
  reset() {
    this.loginForm.reset();
    this.previews = [];
    this.loginForm.get('firstName').clearValidators();
    this.loginForm.get('firstName').updateValueAndValidity();
    this.loginForm.get('lastName').clearValidators();
    this.loginForm.get('lastName').updateValueAndValidity();
    this.loginForm.get('emailaddress').clearValidators();
    this.loginForm.get('emailaddress').updateValueAndValidity();
  }


}
