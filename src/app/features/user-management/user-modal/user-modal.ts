import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/authService';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal implements OnInit{
  roles: Role[] = [];
  isEditMode = false;
  
  form = inject(FormBuilder).group({
    id: [uuidv4()],
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    password: ['default123'],
  });

  http = inject(HttpClient);
  dialogRef = inject(MatDialogRef<UserModal>);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authservice: AuthService) {
    this.isEditMode = !!data;
    if (data) {
      this.form.patchValue(data);
      this.form.get('username')?.disable();
    }
  }

  ngOnInit() {
    this.authservice.getRoles().subscribe((data) => (this.roles = data));
  }

  onAddUser() {
    if(this.form.invalid) return;
    this.authservice.addUser({
      id: this.form.value.id || '',
      name: this.form.value.name || '',
      username: this.form.value.username || '',
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      role: this.form.value.role || '',
      permissionIds: this.roles.find(role => role.name === this.form.value.role)?.permissionIds || [],
    }).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  onUpdateUser() {
    if(this.form.invalid) return;
    this.authservice.updateUser(this.data.id, {
      id: this.data.id,
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      role: this.form.value.role || '',
      username: this.data.username || '',
      password: this.data.password || '',
      permissionIds: this.roles.find(role => role.name === this.form.value.role)?.permissionIds || [],
    }).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  submit() {
    if (this.form.invalid) return;
    if(this.isEditMode) {
      this.onUpdateUser();
    } else {
      this.onAddUser();
    }
  }
}
