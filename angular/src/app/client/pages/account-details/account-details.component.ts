import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { MyAccountSidebarComponent } from '../../components/common/my-account-sidebar/my-account-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  standalone: true,
  imports: [MyAccountSidebarComponent, ReactiveFormsModule, CommonModule],
})
export class MyAccountDetailsComponent implements OnInit {
  userForm!: FormGroup;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  showPassword = false;
  showNewPassword = false;
  showPasswordConfirmation = false;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService

  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  togglePasswordConfirmationVisibility() {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],
      phone: [
        this.user?.phone?.trim() || '',
        [
          Validators.required,
          Validators.pattern(/^(0[2-9]\d{8}|84[2-9]\d{8})$/),
        ],
      ],
      password: [''],
      new_password: [''],
      new_password_confirmation: [''],
    },
      {
        validators: this.validatePasswordFields(),
      }
    );
  }

  validatePasswordFields() {
    return (formGroup: FormGroup) => {
      const password = formGroup.get('password');
      const newPassword = formGroup.get('new_password');
      const confirmPassword = formGroup.get('new_password_confirmation');

      const isAnyPasswordFilled =
        password?.value || newPassword?.value || confirmPassword?.value;

      if (isAnyPasswordFilled) {
        if (!password?.value || password.value.length < 6) {
          password?.setErrors({ required: true, minLength: 6 });
        }
        if (!newPassword?.value || newPassword.value.length < 6) {
          newPassword?.setErrors({ required: true, minLength: 6 });
        }
        if (!confirmPassword?.value || confirmPassword.value.length < 6) {
          confirmPassword?.setErrors({ required: true, minLength: 6 });
        }
        if (newPassword?.value !== confirmPassword?.value) {
          confirmPassword?.setErrors({ mismatch: true });
        }
        if (password?.value && newPassword?.value === password.value) {
          newPassword?.setErrors({ sameAsOld: true });
        }
      }

      return null;
    };
  }

  get isSaveDisabled(): boolean {
    if (this.userForm.invalid) return true;

    const password = this.userForm.get('password')?.value?.trim();
    const newPassword = this.userForm.get('new_password')?.value?.trim();
    const confirmNewPassword = this.userForm.get('new_password_confirmation')?.value?.trim();

    if (!password && !newPassword && !confirmNewPassword) {
      return false;
    }

    return !password || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword;
  }

  handleSubmit(): void {

    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        if (control && control.invalid) {
          console.log(`⚠ Lỗi ở trường ${field}:`, control.errors);
        }
      });

      this.notificationService.showNotification('Please check your input values.', 'warning');
      return;
    }

    let sanitizedData = { ...this.userForm.value };
    sanitizedData.phone = sanitizedData.phone.replace(/\s+/g, '');

    // Nếu không nhập mật khẩu, xóa khỏi request
    if (!sanitizedData.password) delete sanitizedData.password;
    if (!sanitizedData.new_password) delete sanitizedData.new_password;
    if (!sanitizedData.new_password_confirmation) delete sanitizedData.new_password_confirmation;

    this.userService.changeUserInfo(sanitizedData).subscribe(
      (response: any) => {

        if (response?.success) {
          this.notificationService.showNotification('User information updated successfully!', 'success');

          this.user = { ...this.user, ...sanitizedData };
          localStorage.setItem('user', JSON.stringify(this.user));

          this.userForm.patchValue(this.user);
        } else {
          this.notificationService.showNotification(response?.message || 'Failed to update user info.', 'error');
        }
      },
      (error) => {
        console.error('❌ Error updating user info:', error);
        this.notificationService.showNotification(error.message || 'An error occurred while updating user info.', 'error');
      }
    );
  }


}
