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

import Donation from '../../models/donation/index.model';
import Volunteer from '../../models/volunteer/index.model';
import AccessCard from '../../models/access-card/index.model';
import SocialCard from '../../models/social-card/index.model';

/**
 *
 */
router.get('/download/:segment/:type', async (req: Request, res: Response) => {
  if (req.params.segment === 'donations') {
    Donation.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
        res.json('error happened');
      } else {
        console.log(data);
        const xls = json2xls(data);

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'volunteers') {
    Volunteer.find().exec(function(err: Error, data: {}) {
      if (err) {
        res.json('error happened');
      } else {
        res.json(data)
        const xls = json2xls(data);

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'access-card') {
    AccessCard.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
        console.log(data)
        res.json('error happened');
      } else {
        const xls = json2xls(data);

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
