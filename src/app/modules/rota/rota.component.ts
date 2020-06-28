import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RotaFixaService } from '../../core/rota-fixa.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators
} from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Observable, Subject } from 'rxjs';
import { ConversorService } from '../../core/utils/conversor.service';
import { TransporteService } from '../../core/transporte.service';
import '../../core/utils/rxjs-extensions';
import { LoadingController } from '@ionic/angular';
import { CarpoolService } from 'src/app/core/carpool.service';

@Component({
	selector: 'app-rota',
	templateUrl: './rota.component.html',
	styleUrls: ['./rota.component.scss'],
	providers: [ConversorService, TransporteService, CarpoolService]
})
export class RotaComponent implements OnInit {
	public userPosition;
	public origem;
	public destino;
	public embarque;
	public minhaOrigem;
	public meuDestino;
	public nomeOrigem;
	public nomeDestino;
	public destinoID;
	public userAddress;
	public addressOrigem;
	public addressDestino;
	public searchInputs;
	public transporteSelecionado;
	public veiculoEncontrado = false;
	public gpsPosition;
	public gpsAddress;
	public destinoAddress;
	public destinoPosition;
	public gps;
	public qtdViagens;
	public userTime;
	public usuarioLogado;
	public subjectOrigem: Subject<string> = new Subject<string>();
	public subjectDestino: Subject<string> = new Subject<string>();
	public today = Date.now();
	public moment = moment();

	@ViewChild('placesRef') placesRef: GooglePlaceDirective;

	constructor(
		private rotafixa: RotaFixaService,
		private storage: Storage,
		private geolocation: Geolocation,
		private fb: FormBuilder,
		private routes: ActivatedRoute,
		private route: Router,
		private conversor: ConversorService,
		private transporte: TransporteService,
		private alertController: AlertController,
		private loading: LoadingController,
		private carpool: CarpoolService
	) { }

	ngOnInit() {
		this.getCurrentUser();
		this.getUserPosition();
    this.setUserTime();
		this.inputValidators();
		this.storage.set('selectedDate', this.today);
	}

 //Recupera informaçoes do usuario logado
	getCurrentUser(){
		this.storage.get('usuario').then((usuario)=>{
			let user = {usuario:{id: usuario.id}}
			this.getTravelHistory(user)
		})
	}

	// recupera a data seleciona pelo usuario
	getSelectedDate(date) {
		const selectedDate = date.detail.value;
		this.storage.remove('selectedDate').then(() => {
			this.storage.set('selectedDate', selectedDate);
		});
	}

	// seta automaticamente o horario se o usuario nao escolher 
		setUserTime(){
      const timeUser = this.moment.locale("pt-BR").format("HH:mm")
      this.userTime = timeUser
    }

	// recupera o horario selecionado pelo usuario
	getSelectedTime(time) {
		const selectedTime = time.detail.value
		const horario = selectedTime.slice(11,16)
    this.userTime = horario
	}

		//  recupera a localização do gps do usuário
		getUserPosition() {
			this.geolocation.getCurrentPosition().then(position => {
				this.userPosition = position.coords;
				this.gpsPosition = position.coords;
				this.getUserPositionAddress();
				this.gps = {
					lat: this.userPosition.latitude,
					lng: this.userPosition.longitude
				};
				console.log(this.userPosition);
			});
		}

		// procura o endereço do local onde o usuario está atraves da localização do gps 'latLng' e
	// seleciona como endereço de origem caso nao for digitado
	getUserPositionAddress() {
		const lat = this.userPosition.latitude;
		const lng = this.userPosition.longitude;
		this.rotafixa.getUserAddress(lat, lng).then(userAddress => {
			const result = this.conversor.convertToJson(userAddress._body);
			const address = result.message.json.results[0].formatted_address;
			const addressComponents =
				result.message.json.results[0].address_components;
			this.gpsAddress = address;
			const addressOrigem = { lat, lng, address, addressComponents };
			this.userAddress = address;
			this.addressOrigem = addressOrigem;
		});
	}

		// recupera o endereço de origem  selecionado pela api do google
		setOrigemAddress(origem) {
			const origemAddress = this.conversor.convertAddressToJson(origem);
			console.log(origemAddress);
			const location = origemAddress.geometry.location;
			const endereco = origemAddress.formatted_address;
			const addressComponents = origemAddress.address_components;
			const lat = location.lat;
			const lng = location.lng;
			const address = { lat, lng, endereco, addressComponents };
			this.addressOrigem = address;
			this.gps = { lat: address.lat, lng: address.lng };
			this.userAddress = endereco;
		}

		goHistorico(){
			this.route.navigate(['/historico'])
		}
			// Seta o endereco do destino do usuario para ser enviado para o transporte selecionado
	setDestinoAddress(destino) {
		const destinoAddress = this.conversor.convertAddressToJson(destino);
		console.log(destinoAddress);
		const location = destinoAddress.geometry.location;
		this.destinoPosition = location
		const lat = location.lat;
		const addressComponents = destinoAddress.address_components;
		this.destinoAddress = destinoAddress.formatted_address;
		const lng = location.lng;
		const endereco = destinoAddress.formatted_address;
		const address = { lat, lng, endereco, addressComponents };
		this.addressDestino = address;
	}


	/* Preenche input Embarque */
	setOrigemRotaNome(origem) {
		this.nomeOrigem = origem.origem.nome;
		this.minhaOrigem = [];
	}

	/* Preenche input Destino */
	setDestinoRotaNome(destino) {
		this.nomeDestino = destino.destino.nome;
		this.destinoID = destino.id;
		this.meuDestino = [];
	}

	// valida os campos de pesquisa de origem e destino
	inputValidators() {
		this.searchInputs = this.fb.group({
			origem: [null],
			destino: [null, Validators.required]
		});
	}

	 // inicia spinner para esperar o mapa ser carregado
	 async startMapLoading() {
		const loading = await this.loading.create({
			spinner: 'circles',
			duration: 3000,
			message: 'Realizando solicitação',
			translucent: true
		});

		return await loading.present();
	}

	// envia rota selecionado para colocar no mapa
	sendRotaForMap() {
		const origem = this.addressOrigem;
		const destino = this.addressDestino;
		const gps = this.gps;
		const gpsPosition = {
			lat: this.gpsPosition.latitude,
			lng: this.gpsPosition.longitude
		};
		const rota = { origem, destino, gps };
		this.startMapLoading();
		console.log(rota);
		this.transporte.getTransporteAdequado(rota).then(result => {
			this.transporteSelecionado = result;
			const veiculo = JSON.parse(result);
			if (veiculo.veiculo.tipo === 4) {
				this.alertRotaInexistente();
			} else {
				const transporte = this.transporteSelecionado;
				const origemSelecionada = JSON.stringify(origem);
				const gps = JSON.stringify(gpsPosition);
        const userAddress = this.userAddress;
        const userTime = this.userTime
				const destinoAddress = this.destinoAddress;
				const destinoPosition = JSON.stringify(this.destinoPosition)
				this.route.navigate(['/map'], {
					queryParams: {
						transporte,
						origemSelecionada,
						gps,
						userAddress,
            userTime,
						destinoAddress,
						destinoPosition
					}
				});
			}
		});
	}

	async alertRotaInexistente() {
		const alert = await this.alertController.create({
			header: 'Erro',
			subHeader: 'Erro ao buscar transporte!',
			message: 'Erro ao buscar transporte!',
			buttons: ['OK']
		});

		await alert.present();
	}

	// pega o historico de viagens do usuario atraves do id 
		getTravelHistory(usuario){
			this.carpool.getHistorico(usuario)
			.then((historico)=>{
				let viagens = JSON.parse(historico).message
				this.qtdViagens = viagens.length
				console.log(this.qtdViagens)
			})
		}
}
