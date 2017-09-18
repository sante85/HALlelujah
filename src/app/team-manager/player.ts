import {Team} from './team';
import {Resource} from '../hallelujah/resource';

export class Player extends Resource {

  path = 'players';

  firstName: string;
  lastName: string;
  team: Team;
}
