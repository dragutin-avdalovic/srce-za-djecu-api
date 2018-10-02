import express from 'express';
import { Request, Response } from 'express';
const json2xls = require('json2xls');
// const xlsxj = require('xlsx-to-json');
const excelToJson = require('convert-excel-to-json');
const multer = require('multer');
// const jsPDF = require('jspdf');
// import * as JSPdf from "jspdf";
import fs from 'fs';
const router = express.Router();
import _ from 'lodash';
const flatten = require('flat');

import Donation from '../../models/donation/index.model';
import Volunteer from '../../models/volunteer/index.model';
import AccessCard from '../../models/access-card/index.model';
import SocialCard from '../../models/social-card/index.model';

/**
 *
 */
router.get('/download/:segment/:type', async (req: Request, res: Response) => {
  if (req.params.segment === 'donations') {
    Donation.find().select({ '__v': 0, '_id': 0, 'updatedAt': 0, 'createdAt' : 0, notes: 0}).lean().exec(function(err: Error, data: any) {
      if (err) {
        res.json('error happened');
      } else {
        data.forEach((donator: any) => {
          if (donator.type === 1) {
            donator.type = 'Institucija';
          } else if (donator.type === 2) {
            donator.type = 'Fizičko lice';
          } else if (donator.type === 3) {
            donator.type = 'Pravno lice';
          }
          donator.date = String(donator.date).split(' ')[2] + '-' + String(donator.date).split(' ')[1] + '-' + String(donator.date).split(' ')[3];
          donator.amount = donator.amount + ' KM';
        });
        const newKeys = [
        'Tip',
        'Naziv kompanije',
        'Osnovni podaci',
        'E-mail',
        'Adresa',
        'Grad',
        'Iznos (KM)',
        'Datum donacije',
        'Svrha',
        ];
        data.forEach((donator: any) => {
          let i = 0;
          let old_key = '';
          console.log(donator);
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(donator)[i];
            Object.defineProperty(donator, new_key, Object.getOwnPropertyDescriptor(donator, old_key));
            i++;
          });
        });
        const xls = json2xls(data, {
          fields: {
            Tip: 'string',
            'Naziv kompanije': 'string',
            'Osnovni podaci': 'string',
            'E-mail': 'string',
            Adresa: 'string',
            Grad: 'string',
            'Iznos (KM)': 'string',
            'Datum donacije': 'string',
            Svrha: 'string',
          }
        });
        fs.writeFileSync(__dirname + '/donatori.xlsx', xls, 'binary');
        const file = __dirname + '/donatori.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'volunteers') {
    Volunteer.find().select({ '__v': 0, '_id': 0, 'updatedAt': 0, 'createdAt' : 0, notes: 0}).lean().exec(function(err: Error, data: any) {
      if (err) {
        res.json(err);
      } else {
        data.forEach((volunteer: any) => {
          console.log(volunteer);
          volunteer.dateOfBirth = String(volunteer.dateOfBirth).split(' ')[2] + '-' + String(volunteer.dateOfBirth).split(' ')[1] + '-' + String(volunteer.dateOfBirth).split(' ')[3];
          if (volunteer.volunteeredBefore === true) {
            volunteer.volunteeredBefore = 'Da';
          } else if (volunteer.volunteeredBefore === false) {
            volunteer.volunteeredBefore = 'Ne';
          }
          if (volunteer.jobsToVolunteer === 0) {
            volunteer.jobsToVolunteer = 'Kreativne radionice sa djecom';
          } else if (volunteer.jobsToVolunteer === 1) {
            volunteer.jobsToVolunteer = 'Okupacione radionice sa roditeljima oboljele djece';
          } else if (volunteer.jobsToVolunteer === 2) {
            volunteer.jobsToVolunteer = 'Psihološka podrška roditeljima';
          } else if (volunteer.jobsToVolunteer === 3) {
            volunteer.jobsToVolunteer = 'Poslovi na unutrašnjem održavanju kuće';
          } else if (volunteer.jobsToVolunteer === 4) {
            volunteer.jobsToVolunteer = 'Poslovi na održavanju parka';
          } else if (volunteer.jobsToVolunteer === 5) {
            volunteer.jobsToVolunteer = 'Psihološka podrška roditeljima';
          } else if (volunteer.jobsToVolunteer === 6) {
            volunteer.jobsToVolunteer = 'Marketinške usluge';
          } else if (volunteer.jobsToVolunteer === 7) {
            volunteer.jobsToVolunteer = 'Prevodilačke usluge';
          } else if (volunteer.jobsToVolunteer === 8) {
            volunteer.jobsToVolunteer = 'Usluge prevoza djece na liječenje van BiH';
          } else if (volunteer.jobsToVolunteer === 9) {
            volunteer.jobsToVolunteer = 'Rad na projektu "Moja kosa tvoja kosa';
          } else if (volunteer.jobsToVolunteer === 10) {
            volunteer.jobsToVolunteer = 'Rad na projektu "Rehabilitacioni kamp';
          }
          volunteer.numberOfHours = volunteer.numberOfHours + ' sati';
        });
        const newKeys = [
          'Ime i prezime',
          'Adresa',
          'E-mail',
          'Datum rodjenja',
          'Strucna sprema',
          'Zanimanje',
          'Kontakt telefon',
          'Volontirao prije',
          'Broj sati',
          'Volontirani poslovi'
        ];
        data.forEach((volunteer: any) => {
          let i = 0;
          let old_key = '';
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(volunteer)[i];
            Object.defineProperty(volunteer, new_key, Object.getOwnPropertyDescriptor(volunteer, old_key));
            i++;
          });
        });
        const xls  = json2xls(data, {
          fields: {
            'Ime i prezime': 'string',
            'Adresa': 'string',
            'E-mail': 'string',
            'Datum rodjenja': 'string',
            'Strucna sprema': 'string',
            'Zanimanje': 'string',
            'Kontakt telefon': 'string',
            'Volontirao prije': 'string',
            'Broj sati': 'string',
            'Volontirani poslovi': 'string'}
        });

        fs.writeFileSync(__dirname + '/volonteri.xlsx', xls, 'binary');
        const file = __dirname + '/volonteri.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'access-card') {
    AccessCard.find().select({ 'updatedAt': 0, 'createdAt': 0, '__v': 0, '_id': 0, notes: 0}).lean().exec(function(err: Error, data: any) {
      if (err) {
        res.json('error happened');
      } else {
          data.forEach((card: any) => {
              console.log(card.dateOfBirth);
          if (card.dateOfBirth !== null) {
              card.dateOfBirth = String(card.dateOfBirth).split(' ')[2] + '-' + String(card.dateOfBirth).split(' ')[1] + '-' + String(card.dateOfBirth).split(' ')[3];
          } else {
              card.dateOfBirth = '';
          }
          if (card.dateOfDiagnose !== null) {
              card.dateOfDiagnose = String(card.dateOfDiagnose).split(' ')[2] + '-' + String(card.dateOfDiagnose).split(' ')[1] + '-' + String(card.dateOfDiagnose).split(' ')[3];
          } else {
              card.dateOfDiagnose = '';
          }
          if (card.type === 0) {
            card.type = 'Roditelj';
          } else if (card.type === 1) {
            card.type = 'Prijatelj';
          } else if (card.type === 2) {
            card.type = 'Medicinsko osoblje';
          } else if (card.type === 3) {
            card.type = 'Volonter';
          } else if (card.type === 4) {
            card.type = 'Osoblje';
          }
        });
        const newKeys = [
          'Tip',
          'Ime i prezime',
          'E-mail',
          'Adresa',
          'JMBG',
          'Telefon',
          'Ime djeteta',
          'Datum rodjenja',
          'Dijagnoza',
          'Datum dijagnoze'
        ];
        data.forEach((accessCard: any) => {
          let i = 0;
          let old_key = '';
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(accessCard)[i];
            Object.defineProperty(accessCard, new_key, Object.getOwnPropertyDescriptor(accessCard, old_key));
            i++;
          });
        });
        const xls = json2xls(data, {
          fields: {
            Tip: 'string',
            'Ime i prezime': 'string',
            'E-mail': 'string',
            Adresa: 'string',
            'JMBG': 'string',
            Telefon: 'string',
            'Ime djeteta': 'string',
            'Datum rodjenja': 'string',
            Dijagnoza: 'string',
            'Datum dijagnoze': 'string'
          }
        });

        fs.writeFileSync(__dirname + '/pristupnica.xlsx', xls, 'binary');
        const file = __dirname + '/pristupnica.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'social-card') {
    SocialCard.find().select({ '__v': 0, '_id': 0, 'updatedAt': 0, 'createdAt': 0}).lean().exec(function(err: Error, data: any) {
      if (err) {
        res.json('error happened');
      } else {
          const rename = require('deep-rename-keys');
          const newData = rename(data, function(key: any) {
              if (key === 'child') return 'Dijete';
              else if (key === 'name') return 'Ime';
              else if (key === 'jmbg') return 'JMBG';
              else if (key === 'dateOfBirth') return 'Datum rodjenja';
              else if (key === 'placeOfBirth') return 'Mjesto rodjenja';
              else if (key === 'municipality') return 'Općina';
              else if (key === 'city') return 'Grad';
              else if (key === 'address') return 'Adresa';
              else if (key === 'postNumber') return 'Poštanski broj';
              else if (key === 'goingToSchool') return 'Ide u školu';
              else if (key === 'goingToKindergarden') return 'Ide u vrtić';
              else if (key === 'diagnosed') return 'Dijagnostifikovana bolest';
              else if (key === 'diagnose') return 'Dijagnoza';
              else if (key === 'dateOfDiagnose') return 'Datum dijagnoze';
              else if (key === 'healthState') return 'Zdravstveno stanje';
              else if (key === 'citizenId') return 'Broj lične karte';
              else if (key === 'issuedBy') return 'Izdato od strane';
              else if (key === 'tel') return 'Telefon';
              else if (key === 'mob') return 'Mobilni telefon';
              else if (key === 'working') return 'Radi';
              else if (key === 'position') return 'Pozicija';
              else if (key === 'qualifications') return 'Kvalifikacije';
              else if (key === 'nameOfEmployer') return 'Naziv poslodavca';
              else if (key === 'mother') return 'Majka';
              else if (key === 'meritalStatus') return 'Bračni status';
              else if (key === 'chronicalDecease') return 'Hronično oboljenje';
              else if (key === 'chronicalDeceaseText') return 'Opis hroničnog oboljenja';
              else if (key === 'disability') return 'Invalidnost';
              else if (key === 'disabilityText') return 'Opis invalidnosti';
              else if (key === 'specialNeeds') return 'Posebne potrebe';
              else if (key === 'familyRelations') return 'Odnosi u porodici';
              else if (key === 'incomeBySalary') return 'Prihod od plate';
              else if (key === 'incomeBySalaryText') return 'Opis prihoda od plate';
              else if (key === 'familyPension') return 'Porodična penzija';
              else if (key === 'familyPensionText') return 'Opis porodične penzije';
              else if (key === 'unemploymentBenefit') return 'Dodatak na nezaposlenost';
              else if (key === 'unemploymentBenefitText') return 'Opis dodatka na nezaposlenost';
              else if (key === 'compensationForTheSocialProtectionSystem') return 'Kompenzacija za sistem socijalne zaštite';
              else if (key === 'compensationForTheSocialProtectionSystemText') return 'Opis kompenzacije za sistem socijalne zaštite';
              else if (key === 'otherIncome') return 'Ostali prihodi';
              else if (key === 'otherIncomeText') return 'Opis ostalih prihoda';
              else if (key === 'disabilityCompensation') return 'Dodatak na invalidnost';
              else if (key === 'disabilityCompensationText') return 'Opis dodatka na invalidnost';
              else if (key === 'familyResidence') return 'Mjesto stanovanja';
              else if (key === 'housingConditions') return 'Uslovi stanovanja';
              else if (key === 'residentialBuilding') return 'Vrsta rezidencije';
              else if (key === 'family') return 'Porodica';
              else if (key === 'familyMembers') return 'Članovi porodice';
              else if (key === 'father') return 'Otac';
              return key;
          });
          newData.forEach((Scard: any) => {
          Scard.Dijete['Datum rodjenja'] = String(Scard.Dijete['Datum rodjenja']).split(' ')[2] + '-' + String(Scard.Dijete['Datum rodjenja']).split(' ')[1] + '-' + String(Scard.Dijete['Datum rodjenja']).split(' ')[3];
          if (Scard.Dijete['Ide u školu'] === false) {
            Scard.Dijete['Ide u školu'] = 'Ne';
          } else if ( Scard.Dijete['Ide u školu'] === true) {
            Scard.Dijete['Ide u školu'] = 'Da';
          }
          if (Scard.Dijete['Ide u vrtić'] === false) {
            Scard.Dijete['Ide u vrtić'] = 'Ne';
          } else if ( Scard.Dijete['Ide u vrtić'] === true) {
            Scard.Dijete['Ide u vrtić'] = 'Da';
          }
          if (Scard.Dijete['Dijagnostifikovana bolest'] === false) {
            Scard.Dijete['Dijagnostifikovana bolest'] = 'Ne';
          } else if ( Scard.Dijete['Dijagnostifikovana bolest'] === true) {
            Scard.Dijete['Dijagnostifikovana bolest'] = 'Da';
          }
          Scard.Dijete['Datum dijagnoze'] = String(Scard.Dijete['Datum dijagnoze']).split(' ')[2] + '-' + String(Scard.Dijete['Datum dijagnoze']).split(' ')[1] + '-' + String(Scard.Dijete['Datum dijagnoze']).split(' ')[3];
              if (Scard.Dijete['Zdravstveno stanje'] === 0) {
            Scard.Dijete['Zdravstveno stanje'] = 'Izliječeno';
          } else if (Scard.Dijete['Zdravstveno stanje'] === 1) {
            Scard.Dijete['Zdravstveno stanje'] = 'Završilo sa liječenjem i održavanjem';
          } else if (Scard.Dijete['Zdravstveno stanje'] === 2) {
            Scard.Dijete['Zdravstveno stanje'] = 'Na održavanju';
          } else if (Scard.Dijete['Zdravstveno stanje'] === 3) {
            Scard.Dijete['Zdravstveno stanje'] = 'Ostalo';
          }
          if (Scard.Majka['Radi'] === false) {
            Scard.Majka['Radi'] = 'Ne';
          } else if ( Scard.Majka['Radi'] === true) {
            Scard.Majka['Radi'] = 'Da';
          }
          if (Scard.Otac['Radi'] === false) {
            Scard.Otac['Radi'] = 'Ne';
          } else if ( Scard.Otac['Radi'] === true) {
            Scard.Otac['Radi'] = 'Da';
          }
          if (Scard.Porodica['Bračni status'] === 0) {
            Scard.Porodica['Bračni status'] = 'Neoženjen/Neudata';
          } else if (Scard.Porodica['Bračni status']  === 1) {
            Scard.Porodica['Bračni status'] = 'Oženjen/Udata';
          } else if (Scard.Porodica['Bračni status']  === 2) {
            Scard.Porodica['Bračni status']  = 'Udovac/ica';
          } else if (Scard.Porodica['Bračni status']  === 3) {
            Scard.Porodica['Bračni status']  = 'Razveden/a';
          } else if (Scard.Porodica['Bračni status']  === 4) {
            Scard.Porodica['Bračni status']  = 'Ostalo';
          }
          if (Scard.Porodica['Hronično oboljenje'] === false) {
            Scard.Porodica['Hronično oboljenje'] = 'Ne';
          } else if ( Scard.Porodica['Hronično oboljenje'] === true) {
            Scard.Porodica['Hronično oboljenje'] = 'Da';
          }
          if (Scard.Porodica['Invalidnost'] === false) {
            Scard.Porodica['Invalidnost'] = 'Ne';
          } else if ( Scard.Porodica['Invalidnost'] === true) {
            Scard.Porodica['Invalidnost'] = 'Da';
          }
          if (Scard.Porodica['Posebne potrebe']  === false) {
            Scard.Porodica['Posebne potrebe'] = 'Ne';
          } else if ( Scard.Porodica['Posebne potrebe'] === true) {
            Scard.Porodica['Posebne potrebe'] = 'Da';
          }
          if (Scard.Porodica['Odnosi u porodici'] === 0) {
            Scard.Porodica['Odnosi u porodici'] = 'Dobri';
          } else if (Scard.Porodica['Odnosi u porodici']  === 1) {
            Scard.Porodica['Odnosi u porodici'] = 'Odlični';
          } else if (Scard.Porodica['Odnosi u porodici']  === 2) {
            Scard.Porodica['Odnosi u porodici']  = 'Problematični';
          }
          if (Scard.Porodica['Prihod od plate'] === false) {
            Scard.Porodica['Prihod od plate'] = 'Ne';
          } else if ( Scard.Porodica['Prihod od plate'] === true) {
            Scard.Porodica['Prihod od plate'] = 'Da';
          }
          if (Scard.Porodica['Porodična penzija'] === false) {
            Scard.Porodica['Porodična penzija'] = 'Ne';
          } else if ( Scard.Porodica['Porodična penzija'] === true) {
              Scard.Porodica['Porodična penzija'] = 'Da';
          }
          if (Scard.Porodica['Dodatak na nezaposlenost'] === false) {
            Scard.Porodica['Dodatak na nezaposlenost'] = 'Ne';
          } else if ( Scard.Porodica['Dodatak na nezaposlenost'] === true) {
            Scard.Porodica['Dodatak na nezaposlenost'] = 'Da';
          }
          if (Scard.Porodica['Dodatak na invalidnost'] === false) {
            Scard.Porodica['Dodatak na invalidnost'] = 'Ne';
          } else if ( Scard.Porodica['Dodatak na invalidnost'] === true) {
            Scard.Porodica['Dodatak na invalidnost'] = 'Da';
          }
          if (Scard.Porodica['Kompenzacija za sistem socijalne zaštite'] === false) {
            Scard.Porodica['Kompenzacija za sistem socijalne zaštite'] = 'Ne';
          } else if ( Scard.Porodica['Kompenzacija za sistem socijalne zaštite'] === true) {
            Scard.Porodica['Kompenzacija za sistem socijalne zaštite'] = 'Da';
          }
          if (Scard.Porodica['Ostali prihodi'] === false) {
            Scard.Porodica['Ostali prihodi'] = 'Ne';
          } else if ( Scard.Porodica['Ostali prihodi'] === true) {
            Scard.Porodica['Ostali prihodi'] = 'Da';
          }
          if (Scard.Porodica['Mjesto stanovanja'] === 0) {
            Scard.Porodica['Mjesto stanovanja'] = 'Kuća';
          } else if (Scard.Porodica['Mjesto stanovanja']  === 1) {
            Scard.Porodica['Mjesto stanovanja'] = 'Stan';
          } else if (Scard.Porodica['Mjesto stanovanja']  === 2) {
            Scard.Porodica['Mjesto stanovanja']  = 'Ostalo';
          }
          if (Scard.Porodica['Uslovi stanovanja'] === 0) {
            Scard.Porodica['Uslovi stanovanja'] = 'Dobri';
          } else if (Scard.Porodica['Uslovi stanovanja']  === 1) {
            Scard.Porodica['Uslovi stanovanja'] = 'Odlični';
          } else if (Scard.Porodica['Uslovi stanovanja']  === 2) {
            Scard.Porodica['Uslovi stanovanja']  = 'Zadovoljavajući';
          }
          if (Scard.Porodica['Vrsta rezidencije'] === 0) {
            Scard.Porodica['Vrsta rezidencije'] = 'U sopstvenom vlasništvu';
          } else if (Scard.Porodica['Vrsta rezidencije']  === 1) {
            Scard.Porodica['Vrsta rezidencije'] = 'Iznajmljen';
          } else if (Scard.Porodica['Vrsta rezidencije']  === 2) {
            Scard.Porodica['Vrsta rezidencije']  = 'Vlasništvu roditelja/srodnika';
          } else if (Scard.Porodica['Vrsta rezidencije']  === 3) {
            Scard.Porodica['Vrsta rezidencije']  = 'Ostalo';
          }
        });
          for (const key in newData) {
              console.log( key );
              console.log( newData[key] );
          }
          console.log(newData);
        const xls = json2xls(newData, {
          fields: {'Dijete.Ime': 'string',  'Dijete.JMBG': 'string', 'Dijete.Datum rodjenja': 'string', 'Dijete.Mjesto rodjenja': 'string', 'Dijete.Grad': 'string', 'Dijete.Općina': 'string', 'Dijete.Adresa': 'string', 'Dijete.Poštanski broj': 'string',
          'Dijete.Ide u školu': 'string', 'Dijete.Ide u vrtić': 'string', 'Dijete.Dijagnoza': 'string', 'Dijete.Datum dijagnoze': 'string', 'Dijete.Zdravstveno stanje': 'string', 'Majka.Ime': 'string',
          'Majka.JMBG': 'string', 'Majka.Broj lične karte': 'string', 'Majka.Izdato od strane': 'string',  'Majka.Opština': 'string',  'Majka.Grad': 'string',  'Majka.Adresa': 'string',
          'Majka.Poštanski broj': 'string',  'Majka.Telefon': 'string',  'Majka.Mobilni telefon': 'string',  'Majka.Radi': 'string',  'Majka.Pozicija': 'string',  'Majka.Kvalifikacije': 'string',
          'Majka.Naziv poslodavca': 'string',
          'Otac.Ime': 'string', 'Otac.JMBG': 'string', 'Otac.Broj lične karte': 'string', 'Otac.Izdato od strane': 'string',  'Otac.Opština': 'string',  'Otac.Grad': 'string',  'Otac.Adresa': 'string',
          'Otac.Poštanski broj': 'string',  'Otac.Telefon': 'string',  'Otac.Mobilni telefon': 'string',  'Otac.Radi': 'string',  'Otac.Pozicija': 'string',  'Otac.Kvalifikacije': 'string', 'Otac.Naziv poslodavca': 'string',
          'Porodica.Bračni status': 'string', 'Porodica.Hronično oboljenje': 'string', 'Porodica.Opis hroničnog oboljenja': 'string', 'Porodica.Invalidnost': 'string', 'Porodica.Opis invalidnosti': 'string', 'Porodica.Posebne potrebe': 'string',
          'Porodica.Odnosi u porodici': 'string', 'Porodica.Prihod od plate': 'string', 'Porodica.Opis prihoda od plate': 'string', 'Porodica.Opis porodične penzije': 'string', 'Porodica.Dodatak na nezaposlenost': 'string', 'Porodica.Opis dodatka na nezaposlenost': 'string',
          'Porodica.Dodatak na invalidnost': 'string', 'Porodica.Opis dodatka na invalidnost': 'string',  'Porodica.Kompenzacija za sistem socijalne zaštite': 'string',  'Porodica.Opis kompenzacije za sistem socijalne zaštite': 'string',  'Porodica.Ostali prihodi': 'string',
          'Porodica.Opis ostalih prihoda': 'string', 'Porodica.Mjesto stanovanja': 'string', 'Porodica.Uslovi stanovanja': 'string', 'Porodica.Vrsta rezidencije': 'string'}});
        fs.writeFileSync(__dirname + '/socijalna-karta.xlsx', xls, 'binary');
        const file = __dirname + '/socijalna-karta.xlsx';
        res.download(file);
      }
    });
  } else {
    res.json('no such file');
  }
});

// file upload const
const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: Function) {
    cb(undefined, 'uploads/');
  },
  filename: function (req: Request, file: any, cb: Function) {
    cb(undefined, file.originalname);
  }
});

const upload = multer({ storage: storage });

// ROUTE FOR FILE UPLOAD AND IMPORT IN LIVE TABLE FROM EXCEL TEMPLATE SPREADSHEET
router.post('/uploads/:type', upload.single('data'), async (req: any, res: Response) => {
  const fileType = req.file.originalname.split('.').pop();
  if (fileType === 'xlsx') {
    const result = excelToJson({
      sourceFile: 'uploads/' + req.file.originalname,
      columnToKey: {
        '*': '{{columnHeader}}'
      }
    });
    switch (req.params.type) {
      case 'donation':
        if (Object.keys(result).includes('donators')) {
          await Donation.insertMany(result['donators'].slice(1, result.length), {ordered: false}, function (err: any, response: any) {
            if (err) {
              res.json(err);
            }
            res.json(response);
          });
        } else {
          res.json('Wrong .xlsx file selected.');
        }
        break;
      case 'volunteer':
        if (Object.keys(result).includes('volunteers')) {
          await Volunteer.insertMany(result['volunteers'].slice(1, result.length), {ordered: false}, function (err: any, response: any) {
            if (err) {
              res.json(err);
            }
            res.json(response);
          });
        } else {
          res.json('Wrong .xlsx file selected.');
        }
        break;
      case 'access-card':
        if (Object.keys(result).includes('access-card')) {
          await AccessCard.insertMany(result['access-card'].slice(1, result.length), {ordered: false}, function (err: any, response: any) {
            if (err) {
              res.json(err);
            }
            res.json(response);
          });
        } else {
          res.json('Wrong .xlsx file selected.');
        }
        break;
      case 'social-card':
        if (Object.keys(result).includes('socialCard')) {
        const socialCardArray: any = [];
        const resultObject = result['socialCard'].slice(1, result['socialCard'].length);
        resultObject.forEach((socialCard: any) => {
          const socialCardObject = {child: {}, mother: {}, father: {}, family: {familyMembers: [{}]}, notes: [{}]};
          const socialCardKeysArray = Object.keys(socialCard);
          socialCardKeysArray.forEach((key: any) => {
            if (key.includes('child')) {
              const fullKeyChild = key;
              const keyChild = key.split('_');
              Object.defineProperty(socialCardObject['child'], keyChild[0], {
                enumerable: true,
                configurable: true,
                writable: true,
                value: socialCard[fullKeyChild]
              });
            } else if (key.includes('father')) {
              const fullKeyFather = key;
              const keyFather = key.split('_');
              Object.defineProperty(socialCardObject['father'], keyFather[0], {
                enumerable: true,
                configurable: true,
                writable: true,
                value: socialCard[fullKeyFather]
              });
            } else if (key.includes('mother')) {
              const fullKeyMother = key;
              const keyMother = key.split('_');
              Object.defineProperty(socialCardObject['mother'], keyMother[0], {
                enumerable: true,
                configurable: true,
                writable: true,
                value: socialCard[fullKeyMother]
              });
            } else if (key.includes('family')) {
              const fullKeyFamily = key;
              const keyFamily = key.split('_');
              Object.defineProperty(socialCardObject['family'], keyFamily[0], {
                enumerable: true,
                configurable: true,
                writable: true,
                value: socialCard[fullKeyFamily]
              });
            }
          });
          socialCardArray.push(socialCardObject);
        });
        SocialCard.insertMany(socialCardArray, {ordered: false}, function (err: any, response: any) {
          if (err) {
            res.json(err);
          }
          res.json(response);
        });
        SocialCard.insertMany(socialCardArray).then((docs) => {
          res.json(docs);
        }).catch((err) => {
          res.json(err);
        });
        } else {
          res.json('Wrong .xlsx file selected.');
        }
        break;
      default:
        console.log('Type is missing');
        break;
    }
  } else {
    res.json('Valid file format is .xlsx format');
  }
});

/*Old functions for import*/
/*router.get('/importDonations', (req: Request, res: Response) => {
  xlsxj({
    input: `${__dirname}/donations.xlsx`,
    output: 'test.json',
    sheet: 'donators',
  }, function (err: Error, result: any) {
    if (err) {
      res.json(err);
    } else {
      Donation.insertMany(result, { ordered: false }).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
    }
  });
});
router.get('/importAccessCard', (req: Request, res: Response) => {
  xlsxj({
    input: `${__dirname}/access-card.xlsx`,
    output: 'test.json',
    sheet: 'access-card',
  }, function (err: Error, result: any) {
    if (err) {
      res.json(err);
    } else {
      AccessCard.insertMany(result, { ordered: false }).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
    }
  });
});
router.get('/importVolunteers', (req: Request, res: Response) => {
  xlsxj({
    input: `${__dirname}/volunteers.xlsx`,
    output: 'test.json',
    sheet: 'volunteers',
  }, function (err: Error, result: any) {
    if (err) {
      res.json(err);
    } else {
      Volunteer.insertMany(result, {ordered: false}).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
    }
  });
});
router.get('/importSocialCards', (req: Request, res: Response) => {
  xlsxj({
    input: `${__dirname}/social-card.xlsx`,
    output: 'test.json',
    sheet: 'socialCard',
  }, function (err: Error, result: any) {
    if (err) {
      res.json(err);
    } else {
      SocialCard.insertMany(result, {ordered: false}).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
    }
  });
});
*/
module.exports = router;
