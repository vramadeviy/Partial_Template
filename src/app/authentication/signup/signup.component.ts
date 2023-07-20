import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialzService } from 'src/app/core/service/partialz.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  authForm!: UntypedFormGroup;
  employerAuthForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private readonly _partialzService: PartialzService,
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    
    });
    this.employerAuthForm = this.formBuilder.group({
      eanNumber: ['', Validators.required],
      feinNumber: ['', Validators.required],
    
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }
   //message dispaly
   private showSnackbar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 6000, // Duration in milliseconds
    });
  }
  onSubmit() {
    const userName = this.authForm.get('email'),
      password = this.authForm.get('password'),
      confipassword = this.authForm.get('cpassword');
     
    if (userName!==null && password!==null && confipassword!==null) {
      if (userName !== null && password !== null && password.value.length >=6 && confipassword.value.length>=6) {
        this.sendVeifyemail(userName.value, password.value);
      }
    } else {
      if (confipassword !== null && password !== null && (password.value != confipassword.value)) {
        this.showSnackbar("Password and confirm password does not match", "Close");
      } else {
        this.showSnackbar("Enter Valid Credintials", "Close");
      }
    }
  }
  sendVeifyemail(emailID: string, Password: string): void {
    const body = {
      Email: emailID,
      Password: Password
    };
    
    //this.isProcessing=true;
    this._partialzService.post<any>('https://localhost:7178/api/Employee', body).subscribe(
      (response) => {
        if (response == 1) { 
          this.showSnackbar("Email already verified", "OK");
          localStorage.setItem('email',emailID); 
          //this.isProcessing=false;
        }
        else if(response == 2)
        {
          this.showSnackbar("We have sent you the verification mail please confirm", "OK");
          localStorage.setItem('email',emailID); 
        }
        else {
          this.showSnackbar("Something went wrong please try again", "Close");
        }
      },
      (error) => {
        this.showSnackbar('Error occurred while while processing your request.', "Close");
      }
    );
  }
  onemployerAuthSubmit() {
    const eanNumber = this.employerAuthForm.get('EANNumber'),
      feinNumber = this.employerAuthForm.get('FEINNumber');
    if (this.employerAuthForm.valid) {

      if (eanNumber !== null && feinNumber !== null) {
        const eanNumberValue = eanNumber.value;
        const feinNumberValue = feinNumber.value;
        if (eanNumberValue && feinNumberValue)
          this.authorizEANandFEIN(eanNumberValue, feinNumberValue);

      }
    } else {
      this.showSnackbar("Enter Required Fields", "Close");
    }
  }
  authorizEANandFEIN(eannumber: string, feinnumber: string): void {
    if (eannumber.match("^[0-9]{10}$") && feinnumber.match("^[0-9]{9}$"))
    {
    const body = {
      Eannumber: eannumber,
      Feinnumber: feinnumber
    };
    
    //this.isProcessing=true;
    this._partialzService.post<any>('https://localhost:7178/api/Employer', body).subscribe(
      (data) => {
        {
                
          this.showSnackbar("Authorization successfully", "OK");
         
          // this.employerAuthForm.get('aEANNumber')?.setValue(data.eannumber);
          // this.thirdFormGroup.get('aFEINNumber')?.setValue(data.feinnumber);
          // this.thirdFormGroup.get('employerName')?.setValue(data.employerName);
          // this.thirdFormGroup.get('employerAddress')?.setValue(data.address);
          // this.thirdFormGroup.get('City')?.setValue(data.city);
          // this.thirdFormGroup.get('State')?.setValue(data.state);
          // this.thirdFormGroup.get('Zipcode')?.setValue(data.zip);
          // this.thirdFormGroup.get('Email')?.setValue(data.email);         
        } 
        // else {
        //   this.showSnackbar("Something went wrong please try again", "Close");
        // }
      },
      (error) => {
        this.showSnackbar('Error occurred while while processing your request.', "Close");
      }
    );
    }
    else
    {
      this.showSnackbar(' Enter Valid EAN and FEIN Numbers' , "close");
    }
  }
}
