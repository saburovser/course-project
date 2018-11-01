import { Component, OnInit } from '@angular/core';
import {st} from "@angular/core/src/render3";

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  func: string;
  errors: string[] = [];

  operators = [
    '+',
    '-',
    '*',
    '/',
    '^',
  ];



  constructor() {

  }

  ngOnInit() {
  }

  funcChange(e) {
    this.func = e.match(/[0-9A-Za-z+\-*/^()]*/);
    this.checkForErrors(e);
  }

  checkForErrors(func: string) {
    this.errors = [];
    this.checkParenthesesBalance(func);
    this.checkAdjacentOperators(func);
    this.checkStartEnd(func);
  }

  checkParenthesesBalance(func: string) {
    let parentheses: string[] = [];
    if (func[0] === '(') {
      parentheses.push(func[0]);
    }
    for (let i = 1; i < func.length; i++) {
      if (['(', ')'].includes(func[i])) {
        parentheses.push(func[i]);
        if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
          parentheses.pop();
          parentheses.pop();
        }
      }
    }

    if (parentheses.length !== 0) {
      this.errors.push('Не соблюден баланс скобок');
    }
  }

  checkAdjacentOperators(func: string) {
    for (let i = 1; i < func.length; i++) {
      if (this.operators.includes(func[i]) && this.operators.includes(func[i-1])) {
        this.errors.push('Два оператора подряд');
        break;
      }
    }
  }

  checkStartEnd(func: string) {
    if (this.operators.includes(func[0]) || this.operators.includes(func[func.length - 1])) {
      this.errors.push('Оператор в начале/конце строки');
    }
  }

  diff() {

  }
}
