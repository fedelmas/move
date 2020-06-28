import {Type} from "class-transformer";
import { Horario } from "./horario.model";
import { Localizacao } from './localizacao.model';
import "reflect-metadata";

export class Rota {
	
	@Type(() => Localizacao)
	origem: Localizacao;

	@Type(() => Localizacao)
	destino: Localizacao;

	@Type(() => Horario)
    horarios: Horario[];
 }