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
import { MatSelectModule } from '@angular/material/select';
import { User, Role, Permission } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './role-modal.html',
  styleUrl: './role-modal.scss',
})
export class RoleModal implements OnInit{
  roles: Role[] = [];
  isEditMode = false;
  permissions: Permission[] = [];
  
  form = inject(FormBuilder).group({
    id: [uuidv4()],
    name: ['', Validators.required],
    permissionIds: [[]],
  });

  http = inject(HttpClient);
    dialogRef = inject(MatDialogRef<RoleModal>);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authservice: AuthService) {
    this.isEditMode = !!data;
    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit() {
    this.authservice.getRoles().subscribe((data) => (this.roles = data));
    this.getPermissions();
  }

  getPermissions() {
    this.authservice.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
      }
    });
  }

  onAddRole() {
    if(this.form.invalid) return;
    this.authservice.addRole({
      id: this.form.value.id || '',
      name: this.form.value.name || '',
      permissionIds: this.form.value.permissionIds || []
    }).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  onUpdateRole() {
    if(this.form.invalid) return;
    this.authservice.updateRole(this.data.id, {
      id: this.data.id,
      name: this.form.value.name || '',
      permissionIds: this.form.value.permissionIds || []
    }).subscribe((data) => {
      this.dialogRef.close(true);
    });
  }

  submit() {
    if (this.form.invalid) return;
    if(this.isEditMode) {
      this.onUpdateRole();
    } else {
      this.onAddRole();
    }
  }
}
