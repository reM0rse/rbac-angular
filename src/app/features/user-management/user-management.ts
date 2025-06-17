import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserModal } from './user-modal/user-modal';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService} from '../../core/services/authService';
import { Role, Permission } from '../../shared/utils/enum';
import { SnackbarUtil } from '../../core/utils/snackbar.util';
import { ConfirmModal, ConfirmModalData } from '../../shared/components/confirm-modal/confirm-modal';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  users: User[] = [];
  displayedColumns: string[] = ['name', 'username', 'email', 'role', 'actions'];
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private snackbar: SnackbarUtil,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  canEditUser(): boolean {
    return this.currentUser?.permissionIds?.includes(Permission.edit_user) ?? false;
  }

  canDeleteUser(): boolean {
    return this.currentUser?.permissionIds?.includes(Permission.delete_user) ?? false;
  }

  fetchUsers() {
    this.isLoading = true;
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snackbar.error('Failed to fetch users');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm(user?: any) {
    const dialogRef = this.dialog.open(UserModal, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  deleteUser(id: number, role: string) {
    if(role === Role.SuperAdmin) {
      this.snackbar.error('Super Admin cannot be deleted');
      return;
    }

    const dialogData: ConfirmModalData = {
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmModal, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deleteUser(id).subscribe({
          next: () => {
            this.snackbar.success('User deleted successfully');
            this.fetchUsers();
          },
          error: () => {
            this.snackbar.error('Failed to delete user');
          }
        });
      }
    });
  }
}
