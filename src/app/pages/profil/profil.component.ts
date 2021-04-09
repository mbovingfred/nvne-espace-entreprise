import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { KeycloakSecurityService } from 'src/app/services/keycloak-security.service';
import { UserEntreprise } from 'src/app/model/userspace/userEntreprise.model';
import { AccountServiceService } from 'src/app/services/account-service.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  progress: number;

  constructor(
    public keycloakService:KeycloakSecurityService,
    public accountService:AccountServiceService
    
    ) { }

  public minDate:string;

  public userEntreprise:UserEntreprise = new UserEntreprise();
  // public userEntreprise:UserEntreprise = new UserEntreprise();
  
	public kbis:File;
	public pceId:File;
	public rib:File;

  public errormsg:string="";
  public successmsg:string="";
  public step:number = 1;

  // public userEntreprise = {
  //   nomEntreprise: '',
  //   nom: '',
  //   prenom: '',
  //   email: '',
  //   tel: '',
  //   dateFormContact: '',
  //   uid: '',
  //   kbis: '',
  //   pce_id: '',
  //   adresse: '',
  //   codePostal: '',
  //   activite: '',
  //   rib: '',
  //   desc: '',
  // };

  private parseModel(){
    this.userEntreprise.nom = this.keycloakService.kc.tokenParsed["family_name"];
    this.userEntreprise.prenom = this.keycloakService.kc.tokenParsed["given_name"];
    this.userEntreprise.birthplace = this.keycloakService.kc.tokenParsed["birthplace"];
    this.userEntreprise.birthdate = this.keycloakService.kc.tokenParsed["birthdate"];
    this.userEntreprise.email = this.keycloakService.kc.tokenParsed["email"];
    this.userEntreprise.phoneNumber = this.keycloakService.kc.tokenParsed["phone_number"];
    // console.log(this.userEntreprise.nom)
  }

  parseProfil(data:any){
    this.userEntreprise.kbis = data["kbis"];
    this.userEntreprise.pceId = data["pceId"];
    this.userEntreprise.adresse = data["adresse"];
    this.userEntreprise.postal = data["postal"];
    this.userEntreprise.activite = data["activite"];
    this.userEntreprise.rib = data["rib"];
    this.userEntreprise.description = data["description"];
    this.kbis = data["kbis"];
    this.pceId = data["pceId"];
    this.rib = data["rib"];
  }

  parseFormdata(formData:any){
    this.userEntreprise.postal = formData.postal;
    this.userEntreprise.activite = formData.activite;
    this.userEntreprise.adresse = formData.adresse;
    this.userEntreprise.description = formData.description;
    // this.userEntreprise.description = formData.description;
    // this.userEntreprise.description = formData.description;
    // this.userEntreprise.description = formData.description;
  }

  ngOnInit(): void {
    if (!this.keycloakService.kc.authenticated) {
      this.keycloakService.kc.login();
    }
    // this.userEntreprise;
    this.parseModel();
    this.accountService.findByEmail(this.keycloakService.kc.tokenParsed["email"])
      .subscribe(data=>{
      this.parseProfil(data);
      console.log(data);
      console.log(this.userEntreprise);
    }, err => {
      this.successmsg="";
      // this.errormsg = "Une erreur est survenu. Veuillez réessayer svp";
      console.log(JSON.parse(err._body).message);
    })
  }

  accountManagement(){
    this.keycloakService.kc.accountManagement();
  }

  // private traiterFichiers(){
  //   this.kbis = this.kbis instanceof File? this.kbis : null;
  //   this.pce_id = this.pce_id instanceof File? this.pce_id : null;
  //   this.rib = this.rib instanceof File? this.rib : null;
  // }

  onSave(formdata:any){
    // this.traiterFichiers();
    console.log(formdata);
    this.userEntreprise.uid = this.keycloakService.kc.tokenParsed["sub"];
    this.parseFormdata(formdata);
    console.log(this.userEntreprise);
    this.accountService.enregEntreprise(
      this.userEntreprise, 
      this.kbis instanceof File? this.kbis : new File([""],"unknown.pdf", {type: "text/plain"}), 
      this.pceId instanceof File? this.pceId : new File([""],"unknown.pdf", {type: "text/plain"}), 
      this.rib instanceof File? this.rib : new File([""],"unknown.pdf", {type: "text/plain"})
    ).subscribe(event=>{
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        // this.result = data;
        this.errormsg="";
        if (event.ok) this.successmsg="Enregistrement réussi";
        window.scroll(0,0);
        // this.step = 3;
      }
    }, err=>{
      this.successmsg="";
      this.errormsg = "Une erreur est survenu. Veuillez réessayer svp";
      console.log(JSON.parse(err._body).message);
    });
  }

  setKbis(event){
    console.log("Setting kbis");
    this.kbis = event.target.files[0];
  }

  setPceId(event){
    this.pceId = event.target.files[0];
  }

  setRib(event){
    this.rib = event.target.files[0];
  }
}
