import { Component, OnInit, ViewChild } from '@angular/core';
import { TransporteService } from '../../core/transporte.service';
import { ConversorService } from '../../core/utils/conversor.service';
import { RotaFixaService } from '../../core/rota-fixa.service';
import { CarpoolService } from '../../core/carpool.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var google: any;

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],
	providers: [ConversorService, TransporteService, CarpoolService]
})
export class MapComponent implements OnInit {
	public map;
	public userPosition;
	public destinationMarker;
	public proximoHorario;
	public transporteSelecionado;
	public enderecoEmbarque;
	public embarqueAddress;
	public tipoID;
	public cardBackground;
	public rotaID;
  public cardTitulo;
  public gpsPosition
	public pinDestino = '../../../assets/img/pin-gm.png';
	public pinGPS = '../../../assets/img/pin-walk.png';
	public typeRoad;
	public userAddress
	public userTime
	public destinoAddress
	public destinoPosition
	public configuraTrans: Array<object> = []
	public selectedDate = Date.now();
	@ViewChild('mapMove') mapMove;
	@ViewChild('placesRef') placesRef: GooglePlaceDirective;

	constructor(
		private geolocation: Geolocation,
		private rotafixa: RotaFixaService,
		private activeRoute: ActivatedRoute,
		private routes: Router,
		private storage: Storage,
		private conversor: ConversorService,
		private carpool: CarpoolService
	) {}

	ngOnInit() {
	this.getTransporteAdequado()
	}

	// recupera o transporte adequado e a posição escolhida pelo usuario
	getTransporteAdequado() {
		const transporte = this.activeRoute.snapshot.queryParams.transporte;
    const userPosition = this.activeRoute.snapshot.queryParams.origemSelecionada;
		const gpsPosition = this.activeRoute.snapshot.queryParams.gps
		const userAddress = this.activeRoute.snapshot.queryParams.userAddress
		const destinoAddress = this.activeRoute.snapshot.queryParams.destinoAddress
		const userTime = this.activeRoute.snapshot.queryParams.userTime
		const destinoPosition = this.activeRoute.snapshot.queryParams.destinoPosition
		
		this.transporteSelecionado = JSON.parse(transporte);
    this.userPosition = this.conversor.convertToJson(userPosition);
		this.gpsPosition = this.conversor.convertToJson(gpsPosition)
		this.userAddress = userAddress
		this.userTime = userTime
		this.destinoAddress = destinoAddress
		this.destinoPosition = JSON.parse(destinoPosition)
		this.buscarInformacoes(this.transporteSelecionado.tipo);
		this.getAddressRota();
		this.configureCard(this.transporteSelecionado.tipo);
    this.startMap(this.userPosition.lat, this.userPosition.lng);
	}

	// Iniciando o Mapa
	startMap(latitude, longitude) {	
		this.map = new google.maps.Map(this.mapMove.nativeElement, {
			center: { lat: latitude, lng:longitude },
			zoom: 16,
			disableDefaultUI: true,
			radius: 300,
			mapTypeId: 'roadmap',
		});
		this.setUserMarker();
		let transporteLat =  parseFloat( this.transporteSelecionado.localizacao.lat)
		this.setNextHorario(this.transporteSelecionado);
		
		if(this.userPosition.lat !== transporteLat) {
			this.checkDestinyPosition(this.transporteSelecionado.localizacao);
		}
	}

	// Exibindo a posição selecionada ou gps do  usuário no mapa..
	setUserMarker() {
		const userMarker = new google.maps.Marker({
			position: { lat: this.userPosition.lat, lng: this.userPosition.lng },
			icon: this.pinGPS,
			map: this.map
		});
	}

	// Checando a posição de destino do usuario e coloca no mapa
	checkDestinyPosition(destino) {
		if (this.tipoID  == 2 ) {
			const infowindow = new google.maps.InfoWindow({
				content: 'Embarque Aqui!'
			});
			if (this.destinationMarker == undefined) {
				this.destinationMarker = new google.maps.Marker({
					position: new google.maps.LatLng(destino.lat, destino.lng),
					icon: this.pinDestino,
					map: this.map
				});
			} else {
				this.destinationMarker.setPosition(
					new google.maps.LatLng(destino.lat, destino.lng)
				);
			}
      infowindow.open(this.map, this.destinationMarker);
			this.changeMapRoad(destino);
		}
	}

	// Mostrando sugestão de percurso no mapa

	changeMapRoad(destino) {
		const directionService = new google.maps.DirectionsService();
		const directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true
		});

		const userPosition = {
			lat: this.userPosition.lat,
			lng: this.userPosition.lng
		};

		const roadTrack = {
			origin: userPosition,
			destination: {
				lat: parseFloat(destino.lat),
				lng: parseFloat(destino.lng)
			},
			travelMode: this.typeRoad
		};

		directionService.route(roadTrack, (response, status) => {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap(this.map);
			}
		});
			
    return false;
	}

	// recupera a data selecionada pelo usuario
	getSelectedDate() {
		
		this.storage.get('selectedDate').then(date => {
			this.selectedDate = date;
		});
	}

	// recupera o nome do local de embarque do usuario e do destino idependente do transporte
	getAddressRota() {
		this.tipoID = this.transporteSelecionado.tipo;
    this.enderecoEmbarque = this.userPosition.endereco;
		this.embarqueAddress = this.transporteSelecionado.localizacao.endereco;
	}

	buscarInformacoes(tipo) {
		switch (tipo) {
			case 1:
				this.cardTitulo = 'Car Pool';
				this.typeRoad = google.maps.DirectionsTravelMode.DRIVING;
				break;
			case 2:
				this.cardTitulo = 'Rota Fixa';
        this.typeRoad = google.maps.DirectionsTravelMode.WALKING;
				break;
			case 3:
        this.cardTitulo = 'Taxi';
				this.typeRoad = google.maps.DirectionsTravelMode.DRIVING;
				break;
		}
	}

	// pega o proximo horario baseado no horario atual para exibir no resumo
	setNextHorario(horariodestino) {
		const horaAtual = moment();

		const primeiroHorario: string = _.find(horariodestino.horarios, function(horario) {
			return moment(horario.hora, 'HH:mm').isAfter(horaAtual);
		});

		if(primeiroHorario == undefined){
			return (this.proximoHorario = "Horário indisponivel!!");
		}else{
			return (this.proximoHorario = primeiroHorario);
		}
  }

	// Navega para a tela de horarios enviando o obj
	consultarHorarios() {
		let rotafixa  = JSON.stringify(this.transporteSelecionado)
    let horario = JSON.stringify(this.proximoHorario)
		this.routes.navigate(['/horarios'], {queryParams:{rotafixa, horario}} )
	}
 // gera informaçoes do card automaticamente de acordo com o tipo de transporte
	configureCard(tipo){
		let duplas;

		switch(tipo){
			case 1:
				duplas = [["Embarq", this.userAddress],["Desemb", this.destinoAddress], ["Data", this.selectedDate], ["Hora", this.userTime]]
				break
			case 2:
				duplas = [["De", this.userAddress],[ "Embarq",this.embarqueAddress],["Desemb", this.destinoAddress],["Data", this.selectedDate]]
				break
			case 3:
				duplas = [[]]
				break
	 }
	 this.configuraTrans = duplas.map((value)=>{
		 return {label: value[0], content: value[1]}
	 })
	}
 // confirma corrida de carpool ou taxi 
	confirmarCorrida(){
		const origem  = {lat: this.userPosition.lat, lng:  this.userPosition.lng}
		const destino = {lat: this.destinoPosition.lat, lng: this.destinoPosition.lng}
		const periodo = {data: this.selectedDate , hora: this.userTime}
		const user = {usuario:{id:1}}
		const usuario = JSON.stringify(user)
		const corrida = { usuario, origem, destino, periodo}
		this.carpool.solicitarCorrida(corrida)
			.then(()=>{
				this.routes.navigate(['/historico'])
			})
		
	}
}
