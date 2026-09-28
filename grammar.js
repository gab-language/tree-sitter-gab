const PREC_OPERATOR = 4
const PREC_SEND = 3
const PREC_MACRO = 2
const PREC_MACRO_PREFIX = 1

const op_regex = /[\+\-\*\&\|\/\!\%\=\?><~$@\^]+/
const sym_regex = /[a-zA-Z_][a-zA-Z_\\\d]*/

module.exports = grammar({
  name: 'gab',

  // PSA:
  // DO NOT EVER TRY TO REFACTOR THIS GRAMMER TO PARSE NEWLINES.
  // JUST LEAVE THEM AS EXTRAS.
  extras: $ => [$.comment, $._newline, /\s/],

  rules: {
    source_file: $ =>
      repeat(seq(
        $._expression,
       )),

    _expression: $ =>
      (choice(
        $.message,
        $.record,
        $.list,
        $.block,
        $.symbol,
        $.number,
        $.string,
        $.tuple,
        $.send,
        $.op,
        $.quasiquote,
        $.unquote,
      )),

    send: $ => prec.right(PREC_SEND, seq(
      field('lhs', $._expression),
      field('message', $.send_infix),
      field('rhs', optional($._expression)),
    )),

    op: $ => prec.right(PREC_OPERATOR, seq(
      field('lhs', $._expression),
      field('message', $.op_infix),
      field('rhs', optional($._expression)),
    )),

    quasiquote: $ => seq(
      "\\[",
      field('body', $._expression),
      "]",
    ),

    unquote: $ => seq(
      "\\(",
      field('body', $._expression),
      ")",
    ),

    record: $ => seq(
      '{',
      repeat(
        seq(
          $._expression,
          $._expression,
        ),
      ),
      '}',
    ),

    tuple: $ => seq(
      '(',
      repeat(seq(
        $._expression,
      )),
      ')',
    ),

    list: $ => seq(
      '[',
      repeat(seq(
        $._expression,
      )),
      ']',
    ),

    block: $ => seq(
      'do',
      repeat(seq(
        $._expression,
       )),
      'end',
    ),

    message: _ => token(seq(
      field("name", optional(choice(
        op_regex,
        sym_regex,
      ))),
      ':',
    )),

    send_infix: _ => token(seq(
      '.',
      field("name", optional(choice(
        op_regex,
        sym_regex,
      ))),
    )),

    singlestring: _ => token(seq(
      '\'',
      /[^\']*/,
      '\'',
    )),

    doublestring: _ => token(seq(
      '"',
      /[^\"]*/,
      '"',
    )),

    string: $ => choice(
      $.singlestring,
      $.doublestring,
    ),

    comment: _ => token(seq('#', /.*/)),

    op_infix: _ => token(op_regex),

    macro_infix: _ => token(seq(':', choice(op_regex, sym_regex))),

    symbol: _ => token(sym_regex),


    _newline: _ => token(/[\n;,]/),
    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?(e\d+)?|0x[\da-fA-F]+(p\d+)?/),
  }
})
