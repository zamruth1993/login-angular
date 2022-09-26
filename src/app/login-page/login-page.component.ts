import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../services/email.service';
import { SuucessDialogComponent } from '../suucess-dialog/suucess-dialog.component';
import '../../assets/js/smtp.js'
import { NgxSpinnerService } from "ngx-spinner";

declare let Email:any;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
 


  preview: string = '';
  imageSrc: string = '';
  loginForm: any;
  selectedFiles: any;
  previews: string[] = [];
  limitMessage: string = '';
  numberExceeded: boolean = false;
  emailInvalid: boolean = false;
  emailPattern: any = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/';
  loading = false;

  constructor(private fb: FormBuilder,public dialog: MatDialog,private emailService:EmailService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      emailaddress: ['',[Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      file: new FormControl(''),
    });
    // Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
  }
  save() {
    this.loading = true;
    this.preview = JSON.stringify(this.loginForm.value);
    console.log('loginForm' + this.preview)
     /** spinner starts on init */
     this.spinner.show();

    if(this.loginForm.valid) {
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
        this.openDialog()
      }, 5000);
      this.sendMail();
     
      
      Email.send({
        SecureToken: '726b6420-e0cc-4374-8e2c-cd65fdd3888f',  
        Host : 'smtp.elasticemail.com',
        Username : 'zamruthbegum.1993.sm@gmail.com',
        Password : '1F68C2734BD10E55E7BBE8E913FEAF056878',
        To : this.loginForm.controls.emailaddress.value,
        From : 'zamruthbegum.1993.sm@gmail.com',
        Subject : 'Welcome',
        Body : `
        <i>This is sent as a feedback from my resume page.</i> <br/> `
        }).then();
    }
  }


 

  selectFiles(event: any): void {
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

  openDialog() {
    const dialogRef = this.dialog.open(SuucessDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    // this.reset();
    // this.sendMail();
  }

  sendMail() {
    let valuesFromForm = {
      firstname: this.loginForm.value.firstName,
      lastName: this.loginForm.value.lastName,
      emailAddress: this.loginForm.value.emailaddress
    }
    // let formValues  = this.loginForm.value.emailaddress;
    let reqObj = {
      email: valuesFromForm
    }
    this.emailService.sendMessage(reqObj).subscribe((data: any) =>{
     
      console.log(data);
    })
    this.reset();
  }
  reset() {
    this.loginForm.reset();
  }

 
}
