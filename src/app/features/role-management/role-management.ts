import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService, Permission } from '../../core/services/authService';
import { SnackbarUtil } from '../../core/utils/snackbar.util';
import { ConfirmModal, ConfirmModalData } from '../../shared/components/confirm-modal/confirm-modal';
import { RoleModal } from './role-modal/role-modal';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  roleId?: string;
  role: string;
  permissionIds?: string[];
}

interface Role {
  id: string;
  name: string;
  permissionIds: number[];
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './role-management.html',
  styleUrl: './role-management.scss',
})
export class RoleManagement implements OnInit {
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  roles: any[] = [];
  permissions: Permission[] = [];
  permissionMap: Map<string, string> = new Map();
  displayedColumns: string[] = ['name', 'permissions', 'actions'];
  isLoading = false;

  constructor(
    private authservice: AuthService,
    private snackbar: SnackbarUtil,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchPermissions();
    this.fetchRoles();
  }

  fetchPermissions() {
    this.authservice.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
        this.permissions.forEach(permission => {
          this.permissionMap.set(permission.id.toString(), permission.name);
        });

      },
      error: (error) => {
        console.error('Error fetching permissions:', error);
        this.snackbar.error('Failed to fetch permissions');
      }
    });
  }

  fetchRoles() {
    this.isLoading = true;
    this.authservice.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.snackbar.error('Failed to fetch roles');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // getPermissionNames(permissionIds: number[]): string[] {
  //   console.log('Getting permission names for IDs:', permissionIds);
  //   console.log('Available permissions:', this.permissions);

  //   const name = this.permissions.filter()
  //   const names = permissionIds
  //     .map(id => this.permissions.find(p => p.id === id)?.name)
  //     .filter((name): name is string => name !== undefined);
  //   console.log('Mapped permission names:', names);
  //   return names as string[];
  // }

  openForm(role?: any) {
    const dialogRef = this.dialog.open(RoleModal, {
      data: role,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchRoles();
      }
    });
  }

  deleteRole(id: number) {
    const dialogData: ConfirmModalData = {
      title: 'Delete Role',
      message: 'Are you sure you want to delete this role? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmModal, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authservice.deleteRole(id).subscribe({
          next: () => {
            this.snackbar.success('Role deleted successfully');
            this.fetchRoles();
          },
          error: () => {
            this.snackbar.error('Failed to delete role');
          }
        });
      }
    });
  }
}
