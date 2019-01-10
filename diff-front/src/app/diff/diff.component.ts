import { Component, OnInit } from '@angular/core';
import {DiffTableService} from "./diffTable.service";

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  func: string = '';
  errors: string[] = [];
  terms: any[] = [];
  tree: Node;
  res: string;

  variables: string[] = [];
  selectedVariable: string = '';
  isMultivariable: boolean = false;

  addingFuncName:

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

  knownFunctions = [
    'sin',
    'cos',
    'tan',
    'tg',
    'atan',
    'ctg',
  ];

  diffs: {func: string, diff: string}[] = [
    {
      func: 'sin(x)',
      diff: 'cos(x)',
    },
    {
      func: 'cos(x)',
      diff: '-sin(x)'
    }
  ];

  constructor(private diffTableService: DiffTableService) {

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
    if (this.checkParenthesesBalance(func)) {
      this.checkUnknownFunctions(func);
    }
    this.checkAdjacentOperators(func);
    this.checkStartEnd(func);
    this.checkEmptyParentheses(func);
  }

  checkParenthesesBalance(func: string): boolean {
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
    } else {
      return true;
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

  checkEmptyParentheses(func: string) {
    let chLeft = func[0];

    for (let i = 1; i < func.length; i++) {
      if (func[i] === ')' && chLeft === '(') {
        this.errors.push('Пустые скобки');
        break;
      }
      chLeft = func[i];
    }
  }

  checkUnknownFunctions(func: string) {
    let funct = '';
    let unknownFunctions: string[] = [];

    for (let i = 0; i < func.length; i++) {
      if (/([a-z])+/.test(func[i])) {
        try {

          funct = this.getFunction(func.slice(i)).value.name;

          let functName = '';
          for (let i = 0; i < funct.length; i++) {
            if (funct[i] === '(') {
              break;
            } else {
              functName += funct[i];
            }
          }

          if (!this.knownFunctions.includes(functName)) {
            unknownFunctions.push(functName);
          }

          i += funct.length;
        } catch (e) {

        }
      }
    }

    const fsString = unknownFunctions.reduce( (fs, f) => {
      return fs + ', ' + f;
    }, '');

    if (fsString.length) {
      this.errors.push('Введеные неизвестные функции: ' + fsString.slice(2));
    }
  }

  diff() {
    // @ts-ignore
    this.tree = this.getTree(this.func);

    this.res = '';
    this.isMultivariable = false;

    if (this.variables.length === 1) {
      this.res = this.getNodeDiff(this.tree);
    } else {
      this.isMultivariable = true;
    }
    console.log(this.tree, this.res, this.variables);
    // debugger;
  }

  diffMulti() {
    this.isMultivariable = false;
  }

  getTree(exp: string) {
    let output = [];
    let stack: string[] = [];
    let block;
    while (exp.length) {
      const ch = exp[0];

      if (/([a-z])+/.test(ch)) {
        try {
          block = this.getFunction(exp);
        } catch (e) {
          block = new Node(NodeTypes.Variable, ch, ch.length);

          if (this.variables.indexOf(ch) === -1) {
            this.variables.push(ch);
          }
        } finally {
          output.push(block);
        }
      } else if (ch === '(') {
        block = this.getBlock(exp);
        output.push(block);
      } else if (ch.match(/[0-9]/)) {
        block = this.getNumber(exp);
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
    // this.terms = output;

    let tree = {};
    let treeStack = [];
    // debugger;
    output.filter( el => {
      if (el.type === NodeTypes.Function) {
        treeStack.push(new Node(NodeTypes.Function, new Func(el.value.name, this.getTree(el.value.arg))));
      } else if (el.type === NodeTypes.Block) {
        treeStack.push(this.getTree(el.value));
      } else if (el.type !== undefined) {
        treeStack.push(el);
      } else {
        tree = new Node(NodeTypes.Operator, new Operator(el, treeStack[treeStack.length - 2], treeStack[treeStack.length - 1]));
        treeStack.pop();
        treeStack.pop();
        treeStack.push(tree);
      }
    });
    if (treeStack.length === 1) {
      return treeStack[0];
    }
    return tree;
  }

  getFunction(exp: string) {
    let func = exp[0];
    let arg = '';
    let pos = 1;

    if (exp.length === 1) {
      throw new Error();
    }
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
               arg += exp.slice(pos, i + 1);
               return new Node(NodeTypes.Function, new Func(func, arg.slice(1, arg.length - 1)), func.length + arg.length);
            }
          }
        }
      } else {
        throw new Error();
      }
    }
    return new Node(NodeTypes.Function, new Func(func, arg.slice(1, arg.length - 1)), func.length + arg.length);
    // console.error('если попали сюда, то что-то определенно не так');
  }

  getBlock(exp: string) {
    let block = '';
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
    return new Node(NodeTypes.Block, block.slice(1, block.length - 1), block.length);
  }

  getNumber(exp: string) {
    let num = exp[0];

    for (let i = 1; i < exp.length; i++) {
      const ch = exp[i];
      if (ch.match(/[0-9]/)) {
        num += ch;
      } else if (this.operators.includes(ch)) {
        break;
      }
    }
    return new Node(NodeTypes.Number, num, num.length);
  }

  getNodeView(node: Node): string {
    switch (node.type) {
      case NodeTypes.Function:
        return node.value.name + '(' + this.getNodeView(node.value.arg) + ')';
      case NodeTypes.Number:
        return node.value;
      case NodeTypes.Block:
        return '(' + node.value + ')';
      case NodeTypes.Variable:
        return '(' + node.value + ')';
      case NodeTypes.Operator:
        return this.getNodeView(node.value.arg1) + node.value.name + this.getNodeView(node.value.arg2);
      case NodeTypes.Constant:
        return '(' + node.value + ')';
    }
  }

  getNodeDiff(node: Node): string {
    switch (node.type) {
      case NodeTypes.Function:
        if (node.value.arg.type === NodeTypes.Variable) {
          return this.diffs.find(el => el.func === node.value.name + '(x)').diff.replace('x', this.getNodeView(node.value.arg));
        } else if (node.value.arg.type === NodeTypes.Constant) {
          return '0';
        }
        return this.diffs.find(el => el.func === node.value.name + '(x)').diff.replace('x', this.getNodeView(node.value.arg)) + '*(' + this.getNodeDiff(node.value.arg) + ')';
      case NodeTypes.Variable:
        return '1';
      case NodeTypes.Constant:
        return '0';
      case NodeTypes.Number:
        return '0';
      case NodeTypes.Operator:
        if (node.value.name === '+' || node.value.name === '-') {
          return '(' + node.value.arg1.diff + node.value.name + node.value.arg2.diff + ')';
        } else if (node.value.name === '*') {
          return '(' + node.value.arg1.diff + '*' + node.value.arg2.view + '+' + node.value.arg2.diff + '*' + node.value.arg1.view + ')';
        } else if (node.value.name === '/') {
          return '(' + node.value.arg1.diff + '*' + node.value.arg2.view + '-' + node.value.arg2.diff + '*' + node.value.arg1.view + ')' + '/(' + node.value.arg2.view + ')^2';
        }
    }
  }
}

export class Node {
  type: number;
  value: any;
  length: number;

  // get view(): string {
  //   switch (this.type) {
  //     case NodeTypes.Function:
  //       return this.value.name + '(' + this.value.arg.view + ')';
  //     case NodeTypes.Number:
  //       return this.value;
  //     case NodeTypes.Block:
  //       return '(' + this.value + ')';
  //     case NodeTypes.Variable:
  //       return '(' + this.value + ')';
  //     case NodeTypes.Operator:
  //       return this.value.view;
  //     case NodeTypes.Constant:
  //       return '(' + this.value.view + ')';
  //   }
  //
  // }

  // get diff(): string {
  //   switch (this.type) {
  //     case NodeTypes.Function:
  //       if (this.value.arg.type === NodeTypes.Variable) {
  //         return this.diffs[this.value.name] + this.value.arg.view;
  //       } else if (this.value.arg.type === NodeTypes.Constant) {
  //         return '0';
  //       }
  //       return this.diffs[this.value.name] + '(' + this.value.arg.view + ')' + '*(' + this.value.arg.diff + ')';
  //     case NodeTypes.Variable:
  //       return '1';
  //     case NodeTypes.Constant:
  //       return '0';
  //     case NodeTypes.Number:
  //       return '0';
  //     case NodeTypes.Operator:
  //       if (this.value.name === '+' || this.value.name === '-') {
  //         return '(' + this.value.arg1.diff + this.value.name + this.value.arg2.diff + ')';
  //       } else if (this.value.name === '*') {
  //         return '(' + this.value.arg1.diff + '*' + this.value.arg2.view + '+' + this.value.arg2.diff + '*' + this.value.arg1.view + ')';
  //       } else if (this.value.name === '/') {
  //         return '(' + this.value.arg1.diff + '*' + this.value.arg2.view + '-' + this.value.arg2.diff + '*' + this.value.arg1.view + ')' + '/(' + this.value.arg2.view + ')^2';
  //       }
  //   }
  // }

  constructor(type: number, value: any, length?: number) {
    this.type = type;
    this.value = value;
    this.length = length;
  }
}

export class Func {
  name: string;
  arg: any;

  constructor(name: string, arg: any) {
    this.name = name;
    this.arg = arg;
  }
}

export class Operator {
  name: string;
  arg1: Node;
  arg2: Node;

  constructor(name: string, arg1: Node, arg2: Node) {
    this.name = name;
    this.arg1 = arg1;
    this.arg2 = arg2;
  }

  // get view(): string {
  //   return this.arg1.view + this.name + this.arg2.view;
  // }
}

export enum NodeTypes {
  Constant,
  Variable,
  Function,
  Block,
  Number,
  Operator,
}
