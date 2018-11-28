import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  func: string = '';
  errors: string[] = [];
  terms: string[] = [];

  operators = [
    '+',
    '-',
    '*',
    '/',
    '^',
  ];

  priorities = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
  };

  constructor() {

  }

  ngOnInit() {

  }

  _keyPress(event: any) {
    const pattern = /[0-9A-Za-z+\-*/^()]/;
    let inputChar = event.key;

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  funcChange(e) {
    this.func = e;
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
    this.getRPN(this.func);
  }

  // getTree(exp: string) {
  //   let pos = 0;
  //   let func = '';
  //   let leftOperand = '';
  //   let rightOperand;
  //
  //   let blocks = [];
  //
  //   let block;
  //
  //   while (pos < exp.length) {
  //     const ch = exp.charAt(pos);
  //
  //     if (/([A-Za-z])+/.test(ch)) {
  //       leftOperand += ch;
  //       pos++;
  //       console.log(leftOperand);
  //
  //       continue;
  //     }
  //
  //     if (ch === '(') {
  //       console.log('Нашел блок');
  //
  //       const arg = this.findBlock(exp.slice(pos));
  //       pos += arg.length + 2;
  //
  //       leftOperand += arg;
  //
  //       blocks.push(leftOperand);
  //       console.log(leftOperand);
  //       continue;
  //     }
  //
  //     if (this.operators.includes(ch)) {
  //
  //       let blockToRight = '';
  //
  //       if (this.weakOperators.includes(ch)) {
  //         console.log('Нашел слабый оператор');
  //
  //         let parentheses = [];
  //         let sym = '';
  //         for (let i = pos + 1; i < exp.length ; i++) {
  //           sym = exp[i];
  //
  //           if (this.weakOperators.includes(sym) && parentheses.length === 0) {
  //             break;
  //           }
  //
  //           blockToRight += sym;
  //           if (exp[i] === '(' || exp[i] === ')') {
  //             parentheses.push(exp[i]);
  //             if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
  //               parentheses.pop();
  //               parentheses.pop();
  //             }
  //           }
  //
  //         }
  //       }
  //       else if (this.mediumOperators.includes(ch)) {
  //         console.log('Нашел средний оператор');
  //
  //         let parentheses = [];
  //         let sym = '';
  //         for (let i = pos + 1; i < exp.length ; i++) {
  //           sym = exp[i];
  //
  //           if (this.weakOperators.concat(this.mediumOperators).includes(sym) && parentheses.length === 0) {
  //             break;
  //           }
  //
  //           blockToRight += sym;
  //           if (exp[i] === '(' || exp[i] === ')') {
  //             parentheses.push(exp[i]);
  //             if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
  //               parentheses.pop();
  //               parentheses.pop();
  //             }
  //           }
  //
  //         }
  //       } else {
  //         console.log('Нашел сильный оператор');
  //
  //         let parentheses = [];
  //         let sym = '';
  //         for (let i = pos + 1; i < exp.length ; i++) {
  //           sym = exp[i];
  //
  //           if (this.operators.includes(sym) && parentheses.length === 0) {
  //             break;
  //           }
  //
  //           blockToRight += sym;
  //           if (exp[i] === '(' || exp[i] === ')') {
  //             parentheses.push(exp[i]);
  //             if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
  //               parentheses.pop();
  //               parentheses.pop();
  //             }
  //           }
  //
  //         }
  //       }
  //
  //       blocks.push({
  //         operator: ch,
  //         leftOperand: blocks[blocks.length - 1],
  //         rightOperand: blockToRight,
  //       });
  //
  //       pos += blockToRight.length;
  //       continue;
  //     }
  //     pos++;
  //   }
  //
  //   console.log(blocks);
  // }
  //
  // findBlock(exp: string) {
  //   let parentheses: string[] = [];
  //   parentheses.push(exp[0]);
  //
  //   for (let i = 1; i < exp.length; i++) {
  //     if (['(', ')'].includes(exp[i])) {
  //       parentheses.push(exp[i]);
  //
  //       if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
  //         parentheses.pop();
  //         parentheses.pop();
  //       }
  //
  //       if (parentheses.length === 0) {
  //         return exp.slice(1, i);
  //       }
  //     }
  //   }
  // }

  getRPN(exp: string) {
    let output: string[] = [];
    let stack: string[] = [];
    let block = '';
    while (exp.length) {
      const ch = exp[0];

      if (/([a-z])+/.test(ch)) {
        try {
          block = this.getFunction(exp);
        } catch (e) {
          block = ch;
        } finally {
          output.push(block);
        }
      } else if (ch === '(') {
        block = this.getBlock(exp);
        output.push(block);
      } else {
        block = ch;
        if (!stack.length) {
          stack.push(ch);
        } else if (this.priorities[stack[stack.length - 1]] >= this.priorities[ch]) {
          output.push(stack.pop());
          stack.push(ch);
        } else {
          stack.push(ch);
        }
      }
      exp = exp.slice(block.length);
    }
    while (stack.length) {
      output.push(stack.pop());
    }
    console.log(output);
    this.terms = output;
  }

  getFunction(exp: string) {
    let func = exp[0];
    let pos = 1;

    while (pos < exp.length) {
      const ch = exp[pos];

      if (/([a-z])+/.test(ch)) {
        func += ch;
        pos++;
      } else if (ch === '(') {
        let parentheses: string[] = [];
        parentheses.push(ch);

        for (let i = pos + 1; i < exp.length; i++) {
          if (['(', ')'].includes(exp[i])) {
            parentheses.push(exp[i]);

            if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
              parentheses.pop();
              parentheses.pop();
            }

            if (parentheses.length === 0) {
               func += exp.slice(pos, i + 1);
               return func;
            }
          }
        }
      } else {
        throw new Error();
      }
    }
    return func;
  }

  getBlock(exp: string) {
    let block = '(';
    let parentheses: string[] = [];
    parentheses.push('(');

    for (let i = 1; i < exp.length; i++) {
      if (['(', ')'].includes(exp[i])) {
        parentheses.push(exp[i]);

        if (parentheses[parentheses.length - 2] === '(' && parentheses[parentheses.length - 1] === ')') {
          parentheses.pop();
          parentheses.pop();
        }

        if (parentheses.length === 0) {
          block += exp.slice(0, i + 1);
          break;
        }
      }
    }
    return block;
  }
}
