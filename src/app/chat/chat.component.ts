import { Component, OnInit, EventEmitter,Output, NgZone } from '@angular/core';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client'
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje= new Mensaje();
  mensajes: Mensaje[] = [];
  notification: Mensaje = new Mensaje();
  notificaciones: Mensaje[]=[];
  repetir=0;

  constructor(private _ngZone: NgZone) {
    window['chat']={component: this, zone: _ngZone}
   }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory=() =>{
      return new SockJS("https://trabajo-chat-backend.herokuapp.com/chat-websocket");
    }

    this.client.onConnect = (frame) => {
      console.log('Conectados: '+ this.client.connected+ ': '+ frame);
      this.conectado=true;

      this.client.subscribe('/chat/mensaje', e =>{
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);

        if(!this.mensaje.color && mensaje.tipo=="NUEVO_USUARIO" && this.mensaje.username == mensaje.username){
          this.mensaje.color= mensaje.color;
          this.notification.texto="@"+this.mensaje.username+" se a conetado!!"
          this.notification.nuevo=true;
          console.log('Notificacion desde el chat mensaje'+this.notification.texto)
        }
        

        this.mensajes.push(mensaje);
      });

      this.mensaje.tipo='NUEVO_USUARIO';
      this.client.publish({destination: '/app/mensaje', body:JSON.stringify(this.mensaje)});

      this.client.subscribe('/chat/notificacion', e=>{
        let notificacionServer: Mensaje = JSON.parse(e.body) as Mensaje;
        notificacionServer.fecha = new Date(notificacionServer.fecha);
        this.notification=notificacionServer;
        this.notification.nuevo=true
        console.log('Notificacion desde el chat notificacion: '+this.notification.nuevo)
        console.log(notificacionServer)
        this.notificaciones.push(notificacionServer);
        console.log(this.notificaciones);
      })
    }

    
    this.client.onDisconnect= (frame)=>{
      console.log('Desconectados: '+ !this.client.connected+ ': '+ frame);
      this.conectado=false;
    }
  }
  
  getMensaje():Mensaje{
    return this.mensaje;
  }
  conectar():void{
    this.client.activate()
  }

  desconectar():void{
    this.client.deactivate()

  }

  enviarMensaje():void{
    this.mensaje.tipo='MENSAJE';
    this.client.publish({destination: '/app/mensaje', body:JSON.stringify(this.mensaje)});
    this.mensaje.texto = '';
  }
  notificionBanio():void{
    this.mensaje.tipo='NOTIFICACION';
    this.client.publish({destination: '/app/notificacion', body: JSON.stringify(this.mensaje)});
    this.mensaje.texto=this.mensaje.username+' a salido de baño!!';
  }

  cancelarNot():void{
    this.mensaje.tipo='NOTIFICACION';
    this.client.publish({destination: '/app/notificacion', body: JSON.stringify(this.mensaje)});
    this.mensaje.texto='';
    this.mensaje.nuevo=false;
  }

  getNotNuevo():boolean{
    return this.notification.nuevo;
  }

  setToFalseNot():void{
    this.notification.nuevo=false
    this.cancelarNot();
  }

  irDeBanio():void{
    this.notification.tipo='BAÑO';
    this.notification.username=this.mensaje.username;
    this.notification.texto ='@'+this.notification.username+': Pidio baño!!';
    this.notification.fecha=null;
    this.client.publish({destination: '/app/notificacion', body: JSON.stringify(this.notification)});
    this.notification.texto='';
    this.notification.banio=true
    console.log("username notificacion: "+this.notification.username)
    console.log("username mensaje: "+this.mensaje.username)
  }

  volverDeBanio():void{
    this.notification.tipo='BAÑO';
    this.notification.username=this.mensaje.username;
    this.notification.fecha=null;
    this.notification.texto ='@'+this.notification.username+': Volvio de baño!!';
    this.client.publish({destination: '/app/notificacion', body:JSON.stringify(this.notification)});
    this.notification.texto='';
    this.notification.banio=false

    console.log("username notificacion: "+this.notification.username)
    console.log("username mensaje: "+this.mensaje.username)
  }
}
