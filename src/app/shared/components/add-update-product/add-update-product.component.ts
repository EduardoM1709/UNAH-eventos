import { Component, HostAttributeToken, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

@Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''), 
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    direction: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    time: new FormControl('', [Validators.required]), 
    date: new FormControl('', [Validators.required])
  
  })
    firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
    ngOnInit() {
      this.user = this.utilsSvc.getFromLocalStorage('user');
      if (this.product) this.form.setValue(this.product);
    }
    // Tomar/Seleccionar Imagen

async takeImage(){
const dataUrl = (await this.utilsSvc.takePicture('Imagen del Evento')).dataUrl;
this.form.controls.image.setValue(dataUrl);

}

  submit(){
    if (this.form.valid){
      if(this.product) this.updateProduct();
      else this.createProduct();
    }
  }

// Crear Producto
async createProduct(){
    
      let path = `users/${this.user.uid}/products`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    // Subir la imagen y obtener URL
let dataUrl = this.form.value.image;
let imagePath = `${this.user.uid}/${Date.now()}`
let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
this.form.controls.image.setValue(imageUrl);
delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async res=>{
      this.utilsSvc.presentToast({
        message: 'Evento creado exitosamente',
        duration: 1500,
        color: 'succes',
        position: 'middle',
        icon: 'checkmark-circle-outline'
  
  
      })
      
      
    }).catch(error => {
      console.log(error);
  this.utilsSvc.dismissModal({ succes: true});
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
  
  
      })
  
    }).finally(() => {
      loading.dismiss();
    })
  
  }
// Actualizar Producto
  async updateProduct(){
    
      let path = `users/${this.user.uid}/products/${this.product.id}`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    // Subir la imagen y obtener URL
    if (this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res=>{
      this.utilsSvc.dismissModal({ success: true});
      this.utilsSvc.presentToast({
        message: 'Evento actualizado exitosamente',
        duration: 1500,
        color: 'succes',
        position: 'middle',
        icon: 'checkmark-circle-outline'
  
  
      })
      
      
    }).catch(error => {
      console.log(error);
  this.utilsSvc.dismissModal({ succes: true});
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
  
  
      })
  
    }).finally(() => {
      loading.dismiss();
    })
 
  }

  
}
