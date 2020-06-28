import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CarpoolService } from 'src/app/core/carpool.service';
import { ConversorService } from 'src/app/core/utils/conversor.service';
import { Storage } from '@ionic/storage';

interface HistAddress {
	origem?: string;
	destino?: string;
}

@Component({
	selector: 'app-historico',
	templateUrl: './historico.component.html',
	styleUrls: ['./historico.component.scss'],
	providers: [CarpoolService, ConversorService]
})
export class HistoricoComponent implements OnInit {
	public usuario;
	public historico;
	public origemViagem;
	public destinoViagem;
	public viagens;
	public viagemAddress = [];

	constructor(
		private route: ActivatedRoute,
		private carpool: CarpoolService,
    private conversor: ConversorService,
    private storage: Storage
	) {}

	ngOnInit() {
		this.getTravelHistory();
	}
	// pega o historico de viagens do usuario atraves do id
	getTravelHistory() {
    this.storage.get('usuario').then((usuario) =>{
      let user = {usuario: {id: usuario.id}}
      this.usuario = user
      this.carpool.getHistorico(user).then(historico => {
        const viagens = JSON.parse(historico).message;
        this.getTravelAddress(viagens);
      });
    })

	}

	getTravelAddress(viagens) {
		this.viagens = viagens;
		let origemViagem;
		let destinoViagem;

		viagens.forEach(async (viagem, index) => {
			await this.carpool
				.getTravelAddress(viagem.latOrigem, viagem.lngOrigem)
				.then(origemAddress => {
					const result = this.conversor.convertToJson(origemAddress._body);

					origemViagem = result.message.json.results[0].formatted_address;
				});

			await this.carpool
				.getTravelAddress(viagem.latDestino, viagem.lngDestino)
				.then(destinoAddress => {
					const result = this.conversor.convertToJson(destinoAddress._body);
					destinoViagem = result.message.json.results[0].formatted_address;
				});

			this.viagens[index].origemEndereco = origemViagem;
			this.viagens[index].destinoEndereco = destinoViagem;
		});
	}
}
