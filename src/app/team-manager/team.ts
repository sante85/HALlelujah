import {Player} from './player';
import {Resource} from '../hallelujah/resource';

export class Team extends Resource {

  path = 'teams';

  name: string;
  players: Player[];
}
