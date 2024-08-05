import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 1000;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((error) => {
      console.log(error);
      this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!';
      return EMPTY;
      // return throwError(
      //   () =>
      //     new Error(
      //       (this.mensagemErro =
      //         'Ops, ocorreu um erro. Recarregue a aplicação!')
      //     )
      // );
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
