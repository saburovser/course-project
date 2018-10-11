import { Component, OnInit } from '@angular/core';
import {st} from "@angular/core/src/render3";

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  func: string;

  testFuncs: Func[] = [
    new Func('cos', /\bcos\b\([^\(\)]+\)/g),
    new Func('sin', /\bsin\b\([^\(\)]+\)/g),
    new Func('tan', /\btan\b\([^\(\)]+\)/g),
    new Func('atan', /\batan\b\([^\(\)]+\)/g),
    new Func('e^', /e\^\([^\(\)]+\)/g)
  ];

  m = [];

  constructor() {

  }

  ngOnInit() {
    this.func = localStorage.getItem('func');
  }

  funcChange(e) {
    this.func = e;
    localStorage.setItem('func', e);
    this.findFunc();
  }

  findFunc() {
    this.m = [];
    for (let f of this.testFuncs) {
      let regex = f.regex;
      while (true) {
        let t = regex.exec(this.func);
        if (t === null) {
          break;
        }
        this.m.push({
          name: f.funcName,
          arg: this.func.slice(t.index + f.funcName.length + 1, regex.lastIndex - 1)
        });
      }
    }
  }
}

export class Func {
  funcName: string;
  regex: RegExp;

  constructor(name: string, regex: RegExp) {
    this.funcName = name;
    this.regex = regex;
  }
}
