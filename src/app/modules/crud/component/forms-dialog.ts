import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AppService } from "src/app/app.service";

@Component({
    templateUrl: './forms.dialog.html'
})

export class FormDialog implements OnInit {

    dataForm: FormGroup | any;

    loading: boolean = false;
    updatedValue: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<FormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,

        private appService: AppService,
        private snackBar: MatSnackBar
    ) {

    }

    patchForm() {
        this.dataForm.patchValue({
            position: this.data.position,
            name: this.data.name,
            phone: this.data.phone,
            address: this.data.address
        })
    }

    initForm() {
        let rand = Math.floor(Math.random() * (9999 - 1111 + 1)) + 100;
        this.dataForm = this.fb.group({
            position: rand,
            name: null,
            phone: null,
            address: null
        })
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'bottom',
            horizontalPosition: 'right'
        });
    }


    saveChanges() {
        this.loading = true;
        setTimeout(() => {
            if (this.data !== null) {
                this.appService.editData(this.dataForm.value).subscribe(d => {
                    this.updatedValue = d;
                    this.openSnackBar('Data Updated Successfully!', 'ok');
                    this.dialogRef.close({ data: d });
                    this.data = null;
                    this.dataForm.reset();
                });

            } else if(this.data == null) {
                this.appService.addNewDataIntoList(this.dataForm.value).subscribe(data => {
                    this.updatedValue = data;
                    this.openSnackBar('New data Added Successfully!', 'ok');
                    this.dialogRef.close({ data: data });
                    this.dataForm.reset();
                });
            }

            this.loading = false;

        }, 1500)
    }

    ngOnInit() {
        this.initForm();

        if (this.data !== null) {
            this.patchForm();
        }
    }

}