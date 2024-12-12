import {OnInit, inject, Component } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/product.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',

  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
products: Product [] = [];
  ngOnInit() {
  }

user(): User{
  return this.utilsSvc.getFromLocalStorage('user');
}
ionViewWillEnter(){
  this.getProducts();
}
  // Obtener Eventos
  getProducts(){
let path = `users/${this.user().uid}/products`;
let sub = this.firebaseSvc.getCollectionData(path).subscribe({
  next : (res: any) => {
    console.log(res);
    this.products = res;
  sub.unsubscribe();
  }
})
  }
  // Agregar o Actualizar producto
addUpdateProduct(product?: Product){
  this.utilsSvc.presentModal({
  component: AddUpdateProductComponent,
  cssClass: 'add-update-modal',
  componentProps: {product}
})
}
// Confirmar eliminacion del evento 
async confirmeDeleteProduct(product: Product) {
  this.utilsSvc.presentAlert({
    header: 'Eliminar Evento',
    message: 'Quieres eliminar este Evento?!!!',
    buttons: [
      {
        text: 'Cancelar'
      }, {
        text: 'Si, eliminar',
        handler: () => {
          this.deleteProduct(product);
        }
      }
    ]
  });


}
// Eliminar Producto
async deleteProduct(product: Product){
    
  let path = `users/${this.user().uid}/products/${product.id}`
const loading = await this.utilsSvc.loading();
await loading.present();
let imagePath = await this.firebaseSvc.getFilePath(product.image);
await this.firebaseSvc.deleteFile(imagePath);
this.firebaseSvc.deleteDocument(path).then(async res=>{
  this.products = this.products.filter(p => p.id !== product.id);
  
  this.utilsSvc.presentToast({
    message: 'Evento eliminado exitosamente',
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
