import { Component, OnInit } from '@angular/core';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import Wss from '@adonisjs/websocket-client';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  status = 'Sin conexión';
  ws: any;
  messages: any;
  constructor(private sms: SMS) { }
  async ngOnInit() {
    localStorage.setItem('index', '0');
    this.sms.hasPermission();
    this.iniciar();
  }

  async iniciar() {
    this.ws = Wss('ws://smsfree-colombia.herokuapp.com/').connect();
    this.messages = this.ws.subscribe('shippingPending');
    this.ws.on('open', () => {
      this.status = '** conexión generada **';
    });
    this.ws.on('error', (event) => {
      location.reload();
    });
    this.messages.on('close', (error) => {
      location.reload();
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
