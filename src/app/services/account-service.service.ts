import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserEntreprise } from '../model/userspace/userEntreprise.model';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {

  private username:string="mbovingfredy@gmail.com";
  private password:string="Azerty.2020";
  private grant_type:string="client_credentials";
  private client_id:string="account-man-service";
  private client_secret:string="3386cbc2-8fea-4b9e-8e27-f9afa181cc60";
  private admin_login_url:string=environment.authApiUrl+"/auth/realms/nvne-realm/protocol/openid-connect/token";

  private admin_api_client_url:string="http://localhost:8082/keycloak/registerEntreprise";

  public host:string=environment.backendApiUrl;
  private token:any;

  constructor(private httpClient:HttpClient) { }

  registerEntreprise(data): Observable<Object> {
    //if(this.jwtToken==null) this.loadToken();
    console.log("registering ....");

    return this.httpClient.post(this.host+'/users/register/inscripEntreprise',data);
  }

  findByEmail(email:string){
    console.log("rdv ....");
    let formdata: FormData = new FormData();
    formdata.append('email', email);

    return this.httpClient.post(this.host+'/findByEmail',formdata);
  }

  // findByEmail(email:string){
  //   console.log("rdv ....");

  //   return this.httpClient.get(this.host+'/userEntreprises/search/findByEmail?email='+email);
  // }

  prendreRDVEntreprise(data): Observable<Object> {
    //if(this.jwtToken==null) this.loadToken();
    console.log("rdv ....");

    return this.httpClient.patch(this.host+'/users/register/prendreRDVEntreprise',data);
  }

  prendreRDVCollaborateur(data): Observable<Object> {
    //if(this.jwtToken==null) this.loadToken();
    console.log("rdv ....");

    return this.httpClient.patch(this.host+'/users/register/prendreRDVCollaborateur',data);
  }

  registerCollaborateurs(data): Observable<Object> {
    //if(this.jwtToken==null) this.loadToken();
    console.log("registering ....");

    return this.httpClient.post(this.host+'/users/register/registerCollaborateur',data);
  }

  enregEntreprise(userEntreprise:UserEntreprise, kbis:File, pceId:File, rib:File): Observable<HttpEvent<any>> {
    let formdata: FormData = new FormData();
    console.log(userEntreprise);
    console.log(kbis);
    console.log(pceId);
    console.log(rib);

    formdata.append('kbis', kbis);
    formdata.append('pceId', pceId);
    formdata.append('rib', rib);
    formdata.append('userEntreprise', new Blob(
      [JSON.stringify(userEntreprise)],
      { type: "application/json" }
    ));
    //if(this.jwtToken==null) this.loadToken();

    const req = new HttpRequest('POST', this.host+'/register/entreprise', formdata, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }


  private getAdminToken(){
    console.log("getting admin token ..."+this.admin_login_url);
    return this.httpClient.post(this.admin_login_url,
      {
        'grant_type':this.grant_type,
        'client_id':this.client_id,
        'client_secret':this.client_secret
      },
      {
        headers:new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
      }
    );
  }

  // register(data): Observable<HttpEvent<{}>> {
  //   console.log("registering ...");
  //   this.getAdminToken().subscribe(data=>{
  //     this.token = data;
  //     console.log("token ..."+this.token);

  //     let formdata: FormData = new FormData();
  //     console.log(data);

  //     formdata.append('userForm', new Blob(
  //       [JSON.stringify(data)],
  //       { type: "application/json" }
  //     ));
  //     //if(this.jwtToken==null) this.loadToken();

  //     const req = new HttpRequest('POST', this.admin_api_client_url, formdata, {
  //       headers:new HttpHeaders({
  //         Authorization:'Bearer '+this.token.access_token}),
  //         responseType: 'json'
  //     });

  //     return this.httpClient.request(req);
  //   });
  //   return null;

  // }

}
  