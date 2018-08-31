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
          if (donator.type === 0) {
            donator.type = 'Institucija';
          } else if (donator.type === 1) {
            donator.type = 'Fizičko lice';
          } else if (donator.type === 2) {
            donator.type = 'Pravno lice';
          }
          donator.date = String(donator.date).split(' ')[2] + '-' + String(donator.date).split(' ')[1] + '-' + String(donator.date).split(' ')[3];
          donator.amount = donator.amount + ' KM';
        });
        const newKeys = [
          'Osnovni podaci',
          'E-mail',
          'Grad',
          'Adresa',
          'Naziv kompanije',
          'Datum donacije',
          'Tip',
          'Svrha',
          'Iznos (KM)'
        ];
        data.forEach((donator: any) => {
          let i = 0;
          let old_key = '';
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(donator)[i];
            Object.defineProperty(donator, new_key, Object.getOwnPropertyDescriptor(donator, old_key));
            i++;
          });
        });
        const xls = json2xls(data, {
          fields: {
            'Osnovni podaci': 'string',
            'E-mail': 'string',
            Grad: 'string',
            Adresa: 'string',
            'Naziv kompanije': 'string',
            'Datum donacije': 'string',
            Tip: 'string',
            Svrha: 'string',
            'Iznos (KM)': 'string'
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
          'Datum rodjenja',
          'Adresa',
          'E-mail',
          'Kontakt telefon',
          'Strucna sprema',
          'Zanimanje',
          'Volontirao prije',
          'Broj sati',
          'Volontirani poslovi'
        ];
        data.forEach((donator: any) => {
          let i = 0;
          let old_key = '';
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(donator)[i];
            Object.defineProperty(donator, new_key, Object.getOwnPropertyDescriptor(donator, old_key));
            i++;
          });
        });
        const xls  = json2xls(data, {
          fields: {
            'Ime i prezime': 'string',
            'Datum rodjenja': 'string',
            'Adresa': 'string',
            'E-mail': 'string',
            'Kontakt telefon': 'string',
            'Strucna sprema': 'string',
            'Zanimanje': 'string',
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
        console.log(data);
        res.json('error happened');
      } else {
        data.forEach((card: any) => {
          card.dateOfBirth = String(card.dateOfBirth).split(' ')[2] + '-' + String(card.dateOfBirth).split(' ')[1] + '-' + String(card.dateOfBirth).split(' ')[3];
          card.dateOfDiagnose = String(card.dateOfDiagnose).split(' ')[2] + '-' + String(card.dateOfDiagnose).split(' ')[1] + '-' + String(card.dateOfDiagnose).split(' ')[3];
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
        console.log(data);
        const newKeys = [
          'Ime i prezime',
          'JMBG',
          'Adresa',
          'Telefon',
          'E-mail',
          'Tip',
          'Ime djeteta',
          'Datum rodjenja',
          'Dijagnoza',
          'Datum dijagnoze'
        ];
        data.forEach((donator: any) => {
          let i = 0;
          let old_key = '';
          newKeys.forEach((new_key: any) => {
            old_key = Object.keys(donator)[i];
            Object.defineProperty(donator, new_key, Object.getOwnPropertyDescriptor(donator, old_key));
            i++;
          });
        });
        const xls = json2xls(data, {
          fields: {
            'Ime i prezime': 'string',
            'JMBG': 'string',
            Adresa: 'string',
            Telefon: 'string',
            'E-mail': 'string',
            Tip: 'string',
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
        data.forEach((Scard: any) => {
          Scard.child.dateOfBirth = String(Scard.child.dateOfBirth).split(' ')[2] + '-' + String(Scard.child.dateOfBirth).split(' ')[1] + '-' + String(Scard.child.dateOfBirth).split(' ')[3];
          if (Scard.child.goingToSchool === false) {
            Scard.child.goingToSchool = 'Ne';
          } else if ( Scard.child.goingToSchool === true) {
            Scard.child.goingToSchool = 'Da';
          }
          if (Scard.child.goingToKindergarden === false) {
            Scard.child.goingToKindergarden = 'Ne';
          } else if ( Scard.child.goingToKindergarden === true) {
            Scard.child.goingToKindergarden = 'Da';
          }
          if (Scard.child.diagnosed === false) {
            Scard.child.diagnosed = 'Ne';
          } else if ( Scard.child.diagnosed === true) {
            Scard.child.diagnosed = 'Da';
          }
          Scard.child.dateOfDiagnose = String(Scard.child.dateOfDiagnose).split(' ')[2] + '-' + String(Scard.child.dateOfDiagnose).split(' ')[1] + '-' + String(Scard.child.dateOfDiagnose).split(' ')[3];
          if (Scard.child.healthState === 0) {
            Scard.child.healthState = 'Izliječeno';
          } else if (Scard.child.healthState === 1) {
            Scard.child.healthState = 'Završilo sa liječenjem i održavanjem';
          } else if (Scard.child.healthState === 2) {
            Scard.child.healthState = 'Na održavanju';
          } else if (Scard.child.healthState === 3) {
            Scard.child.healthState = 'Ostalo';
          }
          if (Scard.mother.working === false) {
            Scard.mother.working = 'Ne';
          } else if ( Scard.mother.working === true) {
            Scard.mother.working = 'Da';
          }
          if (Scard.father.working === false) {
            Scard.father.working = 'Ne';
          } else if ( Scard.father.working === true) {
            Scard.father.working = 'Da';
          }
          if (Scard.family.meritalStatus === 0) {
            Scard.family.meritalStatus = 'Neoženjen/Neudata';
          } else if (Scard.family.meritalStatus  === 1) {
            Scard.family.meritalStatus = 'Oženjen/Udata';
          } else if (Scard.family.meritalStatus  === 2) {
            Scard.family.meritalStatus  = 'Udovac/ica';
          } else if (Scard.family.meritalStatus  === 3) {
            Scard.family.meritalStatus  = 'Razveden/a';
          } else if (Scard.family.meritalStatus  === 4) {
            Scard.family.meritalStatus  = 'Ostalo';
          }
          if (Scard.family.chronicalDecease === false) {
            Scard.family.chronicalDecease = 'Ne';
          } else if ( Scard.family.chronicalDecease === true) {
            Scard.family.chronicalDecease = 'Da';
          }
          if (Scard.family.disability === false) {
            Scard.family.disability = 'Ne';
          } else if ( Scard.family.disability === true) {
            Scard.family.disability = 'Da';
          }
          if (Scard.family.specialNeeds === false) {
            Scard.family.specialNeeds = 'Ne';
          } else if ( Scard.family.specialNeeds === true) {
            Scard.family.specialNeeds = 'Da';
          }
          if (Scard.family.familyRelations === 0) {
            Scard.family.familyRelations = 'Dobri';
          } else if (Scard.family.familyRelations  === 1) {
            Scard.family.familyRelations = 'Odlični';
          } else if (Scard.family.familyRelations  === 2) {
            Scard.family.familyRelations  = 'Problematični';
          }
          if (Scard.family.incomeBySalary === false) {
            Scard.family.incomeBySalary = 'Ne';
          } else if ( Scard.family.incomeBySalary === true) {
            Scard.family.incomeBySalary = 'Da';
          }
          if (Scard.family.familyPension === false) {
            Scard.family.familyPension = 'Ne';
          } else if ( Scard.family.familyPension === true) {
            Scard.family.familyPension = 'Da';
          }
          if (Scard.family.unemploymentBenefit === false) {
            Scard.family.unemploymentBenefit = 'Ne';
          } else if ( Scard.family.unemploymentBenefit === true) {
            Scard.family.unemploymentBenefit = 'Da';
          }
          if (Scard.family.disabilityCompensation === false) {
            Scard.family.disabilityCompensation = 'Ne';
          } else if ( Scard.family.disabilityCompensation === true) {
            Scard.family.disabilityCompensation = 'Da';
          }
          if (Scard.family.compensationForTheSocialProtectionSystem === false) {
            Scard.family.compensationForTheSocialProtectionSystem = 'Ne';
          } else if ( Scard.family.compensationForTheSocialProtectionSystem === true) {
            Scard.family.compensationForTheSocialProtectionSystem = 'Da';
          }
          if (Scard.family.otherIncome === false) {
            Scard.family.otherIncome = 'Ne';
          } else if ( Scard.family.otherIncome === true) {
            Scard.family.otherIncome = 'Da';
          }
          if (Scard.family.familyResidence === 0) {
            Scard.family.familyResidence = 'Kuća';
          } else if (Scard.family.familyResidence  === 1) {
            Scard.family.familyResidence = 'Stan';
          } else if (Scard.family.familyResidence  === 2) {
            Scard.family.familyResidence  = 'Ostalo';
          }
          if (Scard.family.housingConditions === 0) {
            Scard.family.housingConditions = 'Dobri';
          } else if (Scard.family.housingConditions  === 1) {
            Scard.family.housingConditions = 'Odlični';
          } else if (Scard.family.housingConditions  === 2) {
            Scard.family.housingConditions  = 'Zadovoljavajući';
          }
          if (Scard.family.residentialBuilding === 0) {
            Scard.family.residentialBuilding = 'U sopstvenom vlasništvu';
          } else if (Scard.family.residentialBuilding  === 1) {
            Scard.family.residentialBuilding = 'Iznajmljen';
          } else if (Scard.family.residentialBuilding  === 2) {
            Scard.family.residentialBuilding  = 'Vlasništvu roditelja/srodnika';
          } else if (Scard.family.residentialBuilding  === 3) {
            Scard.family.residentialBuilding  = 'Ostalo';
          }
        });
        const xls = json2xls(data, {
          fields: {'child.name': 'string', 'child.jmbg': 'string', 'child.dateOfBirth': 'string', 'child.placeOfBirth': 'string', 'child.municipality': 'string', 'child.city': 'string', 'child.address': 'string', 'child.postNumber': 'string',
          'child.goingToSchool': 'string', 'child.goingToKindergarden': 'string', 'child.diagnosed': 'string', 'child.diagnose': 'string', 'child.dateOfDiagnose': 'string', 'child.healthState': 'string', 'mother.name': 'string',
          'mother.jmbg': 'string', 'mother.citizenId': 'string', 'mother.issuedBy': 'string',  'mother.municipality': 'string',  'mother.city': 'string',  'mother.address': 'string',
          'mother.postNumber': 'string',  'mother.tel': 'string',  'mother.mob': 'string',  'mother.working': 'string',  'mother.position': 'string',  'mother.qualifications': 'string',
          'mother.nameOfEmployer': 'string',  'father.name': 'string', 'father.jmbg': 'string', 'father.citizenId': 'string', 'father.issuedBy': 'string',  'father.municipality': 'string',  'father.city': 'string',  'father.address': 'string',
          'father.postNumber': 'string',  'father.tel': 'string',  'father.mob': 'string',  'father.working': 'string',  'father.position': 'string',  'father.qualifications': 'string',
          'father.nameOfEmployer': 'string', 'family.meritalStatus': 'string',  'family.chronicalDecease': 'string',  'family.chronicalDeceaseText': 'string',  'family.disability': 'string',
          'family.disabilityText': 'string', 'family.specialNeeds': 'string', 'family.familyRelations': 'string', 'family.incomeBySalary': 'string', 'family.incomeBySalaryText': 'string', 'family.familyPension': 'string',
          'family.familyPensionText': 'string', 'family.unemploymentBenefit': 'string', 'family.unemploymentBenefitText': 'string',
          'family.disabilityCompensation': 'string', 'family.disabilityCompensationText': 'string', 'family.compensationForTheSocialProtectionSystem': 'string', 'family.compensationForTheSocialProtectionSystemText': 'string',
          'family.otherIncome': 'string', 'family.otherIncomeText': 'string',
          'family.familyResidence': 'string', 'family.housingConditions': 'string',  'family.residentialBuilding': 'string'}});

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
