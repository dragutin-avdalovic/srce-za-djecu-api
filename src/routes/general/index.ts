import express from 'express';
import { Request, Response } from 'express';
const json2xls = require('json2xls');
const xlsxj = require('xlsx-to-json');
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
        const xls = json2xls(data);

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'volunteers') {
    Volunteer.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
        res.json('error happened');
      } else {
        const xls = json2xls(data);

        fs.writeFileSync(__dirname + '/data.xlsx', xls, 'binary');
        const file = __dirname + '/data.xlsx';
        res.download(file);
      }
    });
  } else if (req.params.segment === 'access-card') {
    AccessCard.find().select({ '__v': 0, '_id': 0}).lean().exec(function(err: Error, data: {}) {
      if (err) {
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

// ROUTE FOR FILE UPLAOD
router.post('/uploads/:type', upload.single('data'), async (req: any, res: Response) => {
  const result = excelToJson({
    sourceFile: 'uploads/' + req.file.originalname,
    columnToKey: {
      '*': '{{columnHeader}}'
    }
  });
  switch (req.params.type) {
    case 'donation':
      console.log('Donation');
      await Donation.insertMany(result['donators'].slice(1, result.length), {ordered: false}).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
      break;
    case 'access-card':
      console.log('Access card');
      console.log(result['Sheet 1'].slice(1, result.length));
      break;
    case 'social-card':
      console.log('Social card');
      console.log(result['Sheet 1'].slice(1, result.length));
      break;
    default:
      console.log('Type is missing');
      console.log(result['Sheet 1'].slice(1, result.length));
      break;
  }
});

router.get('/importDonations', (req: Request, res: Response) => {
  xlsxj({
    input: `${__dirname}/donations.xlsx`,
    output: 'test.json',
    sheet: 'donators',
  }, function (err: Error, result: any) {
    if (err) {
      res.json(err);
    } else {
      console.log('Donation: ');
      console.log(result);
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
      console.log(result);
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
      console.log(result);
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
      console.log(result);
    } else {
      console.log(result);
      SocialCard.insertMany(result, {ordered: false}).then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
    }
  });
});

module.exports = router;
