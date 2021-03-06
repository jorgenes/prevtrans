import {Component, EventEmitter, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../shared/services';
import {Usuario} from '../../../../shared/models/usuario.model';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {AuthService} from '../../../../shared/seguranca/auth.service';
import {ToastyService} from 'ng2-toasty';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';
import {Observable} from 'rxjs/Observable';

declare const jQuery: any;
declare const Materialize: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  idUsuario: string;
  usuarios: Usuario[];
  senhaForm: FormGroup;
  buscaUsuarioForm: FormGroup;
  buscaControl: FormControl;
  alteraSenhaAction = new EventEmitter<string | MaterializeAction>();
  removerUsuarioAction = new EventEmitter<MaterializeAction>();

  constructor(public auth: AuthService,
              private usuarioService: UsuarioService,
              private formBuilder: FormBuilder,
              private toastyService: ToastyService) {
  }

  ngOnInit() {
    this.buscaUsuarios();
    this.validaForm();
    this.carregarUsuarios();
    this.inicializaMaterialize();
  }

  validaForm() {
    this.senhaForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
      verificaSenha: this.formBuilder.control('', [Validators.required, Validators.minLength(8)])
    }, {validator: UsuariosComponent.equalsTo});
  }

  static equalsTo(group: AbstractControl): { [key: string]: boolean } {
    const senha = group.get('senha');
    const verificaSenha = group.get('verificaSenha');
    if (!senha || !verificaSenha) {
      return undefined;
    }
    if (senha.value !== verificaSenha.value) {
      return {senhaNotMatch: true}
    }
    return undefined;
  }

  buscaUsuarios() {
    if (this.auth.jwtPayload.id_instituicao === 'PREVTRANS_ADMINISTRACAO') {
      this.buscaControl = this.formBuilder.control('');
      this.buscaUsuarioForm = this.formBuilder.group(
        {
          buscaControl: this.buscaControl
        }
      );
      this.buscaControl.valueChanges.debounceTime(500)
        .distinctUntilChanged()
        .switchMap(busca => this.usuarioService.usuarios(busca)
        )
        .catch(erro => Observable.from([]))
        .subscribe(usuarios => {
          if (usuarios) {
            this.usuarios = usuarios;
          } else {
            this.toastyService.info('Usuário não encontrado');
          }
        });
    } else {
      this.buscaControl = this.formBuilder.control('');
      this.buscaUsuarioForm = this.formBuilder.group(
        {
          buscaControl: this.buscaControl
        }
      );
      this.buscaControl.valueChanges.debounceTime(500)
        .distinctUntilChanged()
        .switchMap(busca => this.usuarioService.usuariosPorInstituicao(this.auth.jwtPayload.id_instituicao, busca)
        )
        .catch(erro => Observable.from([]))
        .subscribe(usuarios => {
          if (usuarios) {
            this.usuarios = usuarios;
          } else {
            this.toastyService.info('Usuário não encontrado');
          }
        });
    }
  }

  carregarUsuarios() {
    if (this.auth.jwtPayload.id_instituicao == 'PREVTRANS_ADMINISTRACAO') {
      this.usuarioService.usuarios().subscribe(
        usuarios => {
          this.usuarios = usuarios;
        }
      );
    } else {
      this.usuarioService.usuariosPorInstituicao(this.auth.jwtPayload.id_instituicao)
        .subscribe(
          usuarios => {
            this.usuarios = usuarios;
          }
        );
    }
  }

  setAtivo(usuario: Usuario) {
    usuario.ativo ? usuario.ativo = true : usuario.ativo = false;
    this.usuarioService.ativo(usuario.idUsuario, usuario.ativo).subscribe(
      (response) => {
        if (response.status === 200) {
        }
      }
    );
  }

  alterarSenha(id: string) {
    this.idUsuario = id;
    this.alteraSenhaAction.emit({action: 'modal', params: ['open']});
  }

  fechaModalSenha() {
    this.alteraSenhaAction.emit({action: 'modal', params: ['close']});
  }

  salvarSenha(senha: string) {
    this.usuarioService.alterarSenha(this.idUsuario, senha)
      .subscribe(() => {
          this.fechaModalSenha();
        }
      );
  }

  inicializaMaterialize() {
    jQuery(document).ready(function () {
      Materialize.updateTextFields();
    });
  }

  confirmaModal(idUsuario: string) {
    this.idUsuario = idUsuario;
    this.removerUsuarioAction.emit({action: 'modal', params: ['open']});
  }

  confirmaExcluir(confirma: boolean) {
    if (confirma && this.idUsuario) {
      this.usuarioService.deleteUsuario(this.idUsuario).subscribe(
        () => {
          let index = this.usuarios.findIndex(u => u.idUsuario === this.idUsuario);
          this.usuarios.splice(index, 1);
          this.fechaModal();
          this.confirmacao('Usuário Removido!!');
        }
      );
    }
  }

  fechaModal() {
    this.removerUsuarioAction.emit({action: 'modal', params: ['close']});
  }

  confirmacao(msg: string) {
    this.toastyService.success({
      title: 'Confirmação',
      msg: msg,
      showClose: true,
      timeout: 10000,
      theme: 'default'
    });
  }
}
