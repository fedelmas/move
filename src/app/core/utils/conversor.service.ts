import { Injectable } from '@angular/core';
import { promise } from 'protractor';

@Injectable()
export class ConversorService {
	constructor() {}

	// Converte o resultado da api para json
	convertToJson(objeto) {
		const obj = JSON.parse(objeto);
		const objString = JSON.stringify(obj);
		const objJson = JSON.parse(objString);
		return objJson;
	}

	convertRotaJson(objeto) {
		const objJson = JSON.parse(objeto);
		return objJson;
	}

	// Converte o endereço selecionado para Json
	convertAddressToJson(objeto) {
		const obj = JSON.stringify(objeto);
		const address = JSON.parse(obj);
		return address;
	}

	convertVeiculoToJson(veiculo) {
		const transporte = JSON.parse(veiculo);
		return transporte;
	}
}
