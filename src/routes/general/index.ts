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
        console.log(data);
        data.forEach((donator: any) => {
          if (donator.type === 0) {
            donator.type = 'Institucija';
          } else if (donator.type === 1) {
            donator.type = 'Fizičko lice';
          }  else if (donator.type === 2) {
            donator.type = 'Pravno lice';
          }
          donator.date = String(donator.date).split(' ')[2] + '-' + String(donator.date).split(' ')[1] + '-' + String(donator.date).split(' ')[3];
          donator.amount = donator.amount + ' KM';
        });
        const xls = json2xls(data, {
          fields: {
            name: 'string',
            email: 'string',
            city: 'string',
            address: 'string',
            company: 'string',
            date: 'string',
            type: 'string',
            cause: 'string',
            amount: 'string'}
        });
        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'volunteers') {
    Volunteer.find().lean().exec(function(err: Error, data: any) {
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
        const xls  = json2xls(data, {
          fields: {
            name: 'string',
            dateOfBirth: 'string',
            address: 'string',
            email: 'string',
            phone: 'string',
            qualification: 'string',
            profession: 'string',
            volunteeredBefore: 'string',
            numberOfHours: 'string',
            jobsToVolunteer: 'string'}
        });

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'access-card') {
    AccessCard.find().select({ 'updatedAt': 0, 'createdAt': 0, '__v': 0, '_id': 0, notes: 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
        console.log(data);
        res.json('error happened');
      } else {
        console.log(data)
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

        const xls  = json2xls(data, {
          fields: {
            name: 'string',
            jmbg: 'string',
            address: 'string',
            phone: 'string',
            email: 'string',
            type: 'string',
            childName: 'string',
            dateOfBirth: 'string',
            diagnose: 'string',
            dateOfDiagnose: 'string'}
        });

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'social-card') {
    SocialCard.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
        res.json('error happened');
      } else {
        // const obj = {
        //   key1: {
        //     keyA: 'valueI'
        //   },
        //   key2: {
        //     keyB: 'valueII'
        //   },
        //   key3: { a: { b: { c: 2 } } }
        // }
        // const obj2 = flatten(obj)
        // console.log('obj', obj)
        // console.log('obj2', obj2)
        const xls = json2xls(data);

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
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
