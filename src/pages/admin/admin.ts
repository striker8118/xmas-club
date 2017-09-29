import { currentSlidesPerView } from 'ionic-angular/components/slides/swiper';
import { XmasClubDataProvider } from '../../providers/xmas-club.provider';
import { ScorecardsProvider } from '../../providers/scorecards-provider';
import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import * as _ from 'underscore';
import { Scorecard } from "../../models/scorecard";
import { Score } from "../../models/score";
import { Week } from "../../models/week";

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  scorecards: Scorecard[];
  currentWeek: Week;
  loading: Loading;
  weeklyScoresOutput: string;

  constructor(public navCtrl: NavController,
    private scorecardsProvider: ScorecardsProvider,
    private dataProvider: XmasClubDataProvider,
    private loadingCtrl: LoadingController,
    private alertController: AlertController) {

    this.dataProvider.currentWeek().then((week) => {
      this.currentWeek = week;
    });
  }

  private async loadScorecardsFromEmail() {

    this.showLoading();
    let currentWeek = await this.dataProvider.currentWeek();
    this.scorecards = await this.scorecardsProvider.loadScorecardsFromEmail(currentWeek.week);

    this.navCtrl.push('ListPage', {
      title: 'Loaded scorecards',
      list: this.scorecards.map(sc => sc.nickname)
    });

    this.loading.dismiss();
  }

  private async populateScoresFromScorecards() {

    this.showLoading();

    let weeks = await this.dataProvider.getWeeks();

    let currentWeek = _.find(weeks, (week) => week.week === 3);
    console.log(`Updating scores for week: ` + currentWeek.week);
    //let currentWeek = await this.dataProvider.currentWeek();

    let scorecards = await this.dataProvider.getScorecardResults(currentWeek.week);

    scorecards.forEach(scorecard => {

      this.scorecardsProvider.insertWeeklyScore(scorecard);
    });

    this.loading.dismiss();
  }

  private async forceUpdateOfScores() {
    this.dataProvider.forceUpdateOfScores();
  }

  private async addNewWeek() {


    let alert = this.alertController.create({
      title: 'Confirm',
      message: 'Are you sure you want to create a new week?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.dataProvider.addWeek();
          }
        }
      ]
    });

    alert.present();
  }

  private async showUnsubmittedPicks() {

    this.showLoading();

    let users = await this.dataProvider.getUnsubmittedUsersForWeek(this.currentWeek.week);

    this.navCtrl.push('ListPage', {
      title: 'Unsubmitted Players',
      list: users
    });

    this.loading.dismiss();
  }

  private async outputWeeklyScores() {

    let currentWeek = await this.dataProvider.currentWeek();

    let scorecards = await this.dataProvider.getScorecardResults(currentWeek.week);

    scorecards.forEach(scorecard => {

      this.weeklyScoresOutput += scorecard.nickname + '\t' + scorecard.score + '\n';
    });

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
