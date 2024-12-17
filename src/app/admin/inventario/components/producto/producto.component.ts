import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  image: string;
  descripcion: string;
  estado: boolean;
  categoriaId: number;
}

interface Categoria {
  id: number;
  nombreCategoria: string;
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}

  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  dialog_visible: boolean = false;
  producto_id: number = -1;

  productoForm = new FormGroup({
    nombre: new FormControl<string | null>(null, [Validators.required]),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    image: new FormControl<string | null>(null),
    descripcion: new FormControl<string | null>(null, [Validators.required]),
    estado: new FormControl<boolean | null>(null, [Validators.required, this.booleanValidator]),
    categoriaId: new FormControl<number | null>(null, [Validators.required]),
  });

  // Validador personalizado para verificar que el valor sea 'true' o 'false'
  booleanValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value !== 'true' && value !== 'false') {
      return { invalidBoolean: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.getCategorias();
    this.getProductos();
  }

  // Usar el método del servicio para obtener categorías
  getCategorias() {
    this.productoService.funCategoriaProducto().subscribe(
      (res: any) => {
        console.log('Respuesta completa de categorías:', res);
        this.categorias = res;
        console.log('Categorías cargadas:', this.categorias);
        this.getProductos();
      },
      (error: any) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire('Error', 'No se pudo cargar las categorías.', 'error');
      }
    );
  }

  getProductos() {
    this.productoService.funListar2().subscribe(
      (res: any) => {
        this.productos = res.data;
      },
      (error: any) => {
        Swal.fire('Error', 'No se pudo cargar la lista de productos.', 'error');
        console.error(error);
      }
    );
  }

  // Método para obtener el nombre de la categoría por el ID
  getCategoriaNombre(categoriaId: number): string {
    if (!this.categorias || this.categorias.length === 0) return 'Sin Categoría';
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombreCategoria : 'Sin Categoría';
  }

  guardarProducto() {
    if (!this.productoForm.valid) {
      this.alerta("CAMPOS VACÍOS", "Por favor, completa todos los campos requeridos.", "error");
      return;
    }
  
    console.log("Datos del formulario:", this.productoForm.value); // Verifica qué datos se están enviando
  
    // Clonar los valores del formulario
    const productoData = { ...this.productoForm.value };
  
    // Asegurar que estado sea booleano, manejando null como false
    productoData.estado = !!productoData.estado;
  
    // Validar si los campos 'precio', 'stock' y 'categoriaId' son nulos o indefinidos antes de procesarlos
    if (productoData.precio == null || productoData.precio === undefined) {
      this.alerta("CAMPOS VACÍOS", "El precio no puede estar vacío.", "error");
      return;
    }
    if (productoData.stock == null || productoData.stock === undefined) {
      this.alerta("CAMPOS VACÍOS", "El stock no puede estar vacío.", "error");
      return;
    }
    if (productoData.categoriaId == null || productoData.categoriaId === undefined) {
      this.alerta("CAMPOS VACÍOS", "La categoría no puede estar vacía.", "error");
      return;
    }
  
    // Convierte los valores a los tipos correctos antes de enviar
    productoData.precio = parseFloat(productoData.precio.toString());  // Convertir precio a número
    productoData.stock = parseInt(productoData.stock.toString(), 10);  // Convertir stock a entero
    productoData.categoriaId = parseInt(productoData.categoriaId.toString(), 10);  // Convertir categoriaId a entero
  
    console.log("Datos procesados para enviar al backend:", productoData); // Verifica los datos procesados
  
    if (this.producto_id > 0) {
      // Si el ID del producto es mayor a 0, entonces se trata de una actualización
      this.productoService.funModificar2(this.producto_id, productoData).subscribe(
        () => {
          this.dialog_visible = false;
          this.getProductos();
          this.alerta("ACTUALIZADO", "El producto se modificó con éxito!", "success");
        },
        () => {
          this.alerta("ERROR AL ACTUALIZAR", "Verifica los datos!", "error");
        }
      );
    } else {
      // Si el ID del producto es igual a -1, entonces se trata de un nuevo registro
      this.productoService.funGuardar2(productoData).subscribe(
        () => {
          this.dialog_visible = false;
          this.getProductos();
          this.alerta("REGISTRADO", "El Producto se creó con éxito!", "success");
        },
        () => {
          this.alerta("ERROR AL REGISTRAR", "Verifica los datos!", "error");
        }
      );
    }
  
    this.productoForm.reset();
  }
  

  openNew() {
    this.productoForm.reset();
    this.dialog_visible = true;
    this.producto_id = -1;
  }

  editProduct(prod: Producto) {
    console.log('Producto a editar:', prod); // Verifica los datos del producto
    
    // Si el producto no tiene categoriaId, se asigna null o un valor predeterminado
    const categoriaId = prod.categoriaId !== undefined && prod.categoriaId !== null ? prod.categoriaId : null;
    
    this.dialog_visible = true;
    this.producto_id = prod.id;
    
    // Usamos setValue() y pasamos valores predeterminados si alguno es nulo o indefinido
    this.productoForm.setValue({
      nombre: prod.nombre || '',
      precio: prod.precio,
      stock: prod.stock,
      image: prod.image || '',
      descripcion: prod.descripcion || '',
      estado: prod.estado !== null ? prod.estado : false, // Asegura que estado no sea null
      categoriaId: categoriaId,  // Asegura que categoriaId sea válido
    });
  }
  deleteProduct(prod: Producto) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esto no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.funEliminar2(prod.id).subscribe(
          () => {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            this.getProductos();
          },
          (error: any) => {
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            console.error(error);
          }
        );
      }
    });
  }

  alerta(title: string, text: string, icon: 'success' | 'error' | 'info' | 'question') {
    Swal.fire({
      title,
      text,
      icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
}