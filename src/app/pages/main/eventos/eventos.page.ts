import {OnInit, inject, Component } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
products: Product [] = [];

  ngOnInit() {
  }
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter(){
    this.verProducts();
  }
  
  // Obtener Eventos
  verProducts() {
    const path = 'users/uid/products'; // Ruta a la colección de productos
    const sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any[]) => {
        console.log('Productos obtenidos:', res);
        this.products = res; // Asigna los productos obtenidos a la variable local
        sub.unsubscribe(); // Desuscribirse después de obtener los datos
      },
      error: (err: any) => {
        console.error('Error al obtener productos:', err);
        sub.unsubscribe(); // Asegura la desuscripción en caso de error
      }
    });
  }
  
}
