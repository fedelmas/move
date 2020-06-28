import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class TransporteService {
	public rotaFixaUrl = `http://localhost:36000/move/api/`;
	// public rotaFixaUrl = 'http://move.transformacaodigitalspassu.com.br/move/api/'
	constructor(private http: Http) {}

	// busca transporte adequado de acordo com as regras estabelecidas
	getTransporteAdequado(rota): Promise<any> {
		return this.http
			.post(this.rotaFixaUrl + 'buscarTransporteAdequado', rota)
			.toPromise()
			.then(result => {
				return result["_body"];
			});
	}

	checkVeiculoExiste(result): Promise<any> {
		const veiculo = JSON.parse(result);
		
		return veiculo.tipo;
	}
}
