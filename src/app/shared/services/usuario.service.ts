import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs/Observable';
import {PREVTRANS_API} from '../../app.api';
import {Usuario} from '../models/usuario.model';
import {PrevtransAdminHerrorHandler} from '../../prevtrans-admin/prevtrans-admin-herror-handler';
import {AuthHttp} from 'angular2-jwt';
import {ErrorHandlerService} from '../error-handler.service';
import {UsuarioPermissao} from '../models/UsuarioPermissao.model';

@Injectable()
export class UsuarioService {

  constructor(private http: AuthHttp, private hand: ErrorHandlerService) {
  }

  permissoes(): Observable<UsuarioPermissao[]> {
    return this.http.get(`${PREVTRANS_API}/usuarios/permissoes`)
      .map(response => response.json()).catch(PrevtransAdminHerrorHandler.handleError);
  }

  usuarios(): Observable<Usuario[]> {
    return this.http.get(`${PREVTRANS_API}/usuarios`)
      .map(response => response.json()).catch(PrevtransAdminHerrorHandler.handleError);
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get(`${PREVTRANS_API}/usuarios/${id}`)
      .map(response => response.json()).catch(error => {
        this.hand.handle(error);
        return Observable.of<Usuario>();
      });
  }

  verificaLogin(login: string): Observable<Usuario> {
    return this.http.get(`${PREVTRANS_API}/usuarios/login/${login}`)
      .map(response => response.json()).catch(error => {
        this.hand.handle(error);
        return Observable.of<Usuario>();
      });
  }

  verificaEmail(email: string): Observable<Usuario> {
    return this.http.get(`${PREVTRANS_API}/usuarios/email/${email}`)
      .map(response => response.json()).catch(error => {
        this.hand.handle(error);
        return Observable.of<Usuario>();
      });
  }

  postUsuario(usuario: Usuario): Observable<String> {
    return this.http.post(`${PREVTRANS_API}/usuarios`,
      JSON.stringify(usuario))
      .map(response => response.json());
  }

  putUsuario(id: string, usuario: Usuario): Observable<String> {
    return this.http.put(`${PREVTRANS_API}/usuarios/${id}`,
      JSON.stringify(usuario))
      .map(response => response.json());
  }

  ativo(id: string, ativo: boolean): Observable<any> {
    return this.http.put(`${PREVTRANS_API}/usuarios/${id}/ativo`, ativo)
      .map(response => response.text() ? response.json() : response);
  }

  alterarPerfil(id: string, usuario: Usuario): Observable<any> {
    return this.http.put(`${PREVTRANS_API}/usuarios/${id}/perfil`, JSON.stringify(usuario))
      .map(response => response.json());
  }

  alterarSenha(id: string, senha: string): Observable<any> {
    return this.http.put(`${PREVTRANS_API}/usuarios/${id}/senha`, senha)
      .map(response => response.text() ? response.json() : response);
  }

  deleteUsuario(id: string): Observable<String> {
    return this.http.delete(`${PREVTRANS_API}/usuarios/${id}`)
      .map(response => response.text() ? response.json() : response );
  }

}
