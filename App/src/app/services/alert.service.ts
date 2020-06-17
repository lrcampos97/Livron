import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController) { }

  async presentSuccessToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    toast.present();
  }

  async presentErrorToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: "Fechar"
    });
    toast.present();
  }
}
