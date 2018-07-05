import express from 'express';
import { Request, Response } from 'express';
const json2xls = require('json2xls');
const xlsxj = require('xlsx-to-json');
// const jsPDF = require('jspdf');
// import * as JSPdf from "jspdf";
import fs from 'fs';
const router = express.Router();

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

router.get('/import', (req: Request, res: Response) => {
  let output: any;
  let outputOne: any;
  const table = '/donations';
  // let content: any;
  //
  // fs.readFile(__dirname + '/simple.txt', 'UTF-8', function read(err, data) {
  //   if (err) {
  //     throw err;
  //   }
  //   content = data;
  //
  //   // Invoke the next step here however you like
  //   console.log(content);   // Put all of the code here (not the best solution)
  //   processFile();          // Or put the next step in a function and invoke it
  // });
  //
  // function processFile() {
  //   console.log(content);
  // }

  xlsxj({
    input: `${__dirname}/test.xlsx`,
    output: 'test.json',
    sheet: 'umain'
  }, function (err: Error, result: any) {
    if (err) {
      console.error(err);
    } else {
      //  res.json(result);
      output = result;
      outputOne = output['0'];
      // res.json(output['0']);
      const donation = new Donation(outputOne);
      // res.json(donation);
      donation.save(function (err) {
        if (err) {
          console.error(err);
          res.json(error);
        } else {
          res.json('saved');
        }
      }).then(function(users) {
        return users
      });

    }
  });
});

module.exports = router;
