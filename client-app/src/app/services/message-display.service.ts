import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageDisplayService {

  constructor(private snackBar: MatSnackBar) { }

  displayMessage(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'message-snackbar',
    });
  }
  
}
