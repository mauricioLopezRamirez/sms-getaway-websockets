import { Component, OnInit } from '@angular/core';
import { SmsManager } from '@byteowls/capacitor-sms';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import Wss from '@adonisjs/websocket-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  status = 'nada';
  ws: any;
  messages: any;
  constructor(private sms: SMS,) { }
  async ngOnInit() {
    localStorage.setItem('index', '0');
    this.sms.hasPermission();
  }

  async iniciar() {
    this.ws = Wss('ws://smsfree-colombia.herokuapp.com/').connect();
    this.ws.on('open', () => {
      this.status = 'conexion generada *********';
    });
    this.messages = this.ws.subscribe('shippingPending');
    this.messages.on('close', (error) => {
      console.log(error);
      this.status = 'Conexion perdeda';
    });
    this.messages.on('message', data => {
      this.sendSms(data);
    });
  }

  async sendSms(data) {
    this.status = `${data.cellphone} ${data.message_sent}`;
    this.sms.send('57' + data.cellphone, data.message_sent);
  }

}
