import {Component, OnInit} from '@angular/core';
import {Team} from "./team";
import {Player} from "./player";
import {ResourceService} from "../hallelujah/resource.service";

@Component({
  selector: 'app-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrls: ['./team-manager.component.css']
})
export class TeamManagerComponent implements OnInit {

  players: Player[];
  teams: Team[];
  forms = {
    player: new Player(),
    team: new Team(),
    team_player: null
  };
  selectedTeam: Team;

  constructor(public rs: ResourceService ) { }

  ngOnInit() {
    this.getAllPlayers();
    this.getAllTeams();
  }

  getAllPlayers() {
    this.players = this.rs.getAll(Player, 'players');
  }

  getAllTeams() {
    this.teams = this.rs.getAll(Team, 'teams');
  }

  getTeamPlayers(team: Team) {
    team.players = team.getAll(Player, 'players');
    this.selectedTeam = team;
  }

  addPlayerToTeam() {
    this.selectedTeam.add('players', this.forms.team_player).subscribe(() => this.getTeamPlayers(this.selectedTeam));
  }

  createPlayer() {
    this.rs.create(this.forms.player).subscribe(() => this.getAllPlayers());
  }

  createTeam() {
    this.rs.create(this.forms.team).subscribe(() => this.getAllTeams());
  }

  deleteTeam(team: Team){
    this.rs.delete(team).subscribe(() => this.getAllTeams());
  }

}
