const PREC_OPERATOR = 2
const PREC_SEND = 3
const PREC_SPECIAL_SEND = 4

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
        $.binary_send,
        $.unary_send,
        $.binary_op,
        $.unary_op,
        $.binary_special,
        $.unary_special,
      )),

    binary_send: $ => prec.right(PREC_SEND, seq(
      field('lhs', $._expression),
      field('message', $.send),
      field('rhs', ($._expression)),
    )),

    unary_send: $ => prec.right(PREC_SEND, seq(
      field('lhs', $._expression),
      field('message', $.send),
    )),

    binary_op: $ => prec.right(PREC_OPERATOR, seq(
      field('lhs', $._expression),
      field('message', $.operator),
      field('rhs', ($._expression)),
    )),

    unary_op: $ => prec.right(PREC_OPERATOR, seq(
      field('lhs', $._expression),
      field('message', $.operator),
    )),

    binary_special: $ => prec.right(PREC_SPECIAL_SEND, seq(
      field('lhs', $._expression),
      field('message', choice('=>', '=')),
      field('rhs', ($._expression)),
    )),

    unary_special: $ => prec.right(PREC_SPECIAL_SEND, seq(
      field('lhs', $._expression),
      field('message', choice('=>', '=')),
    )),

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

    send: _ => token(seq(
      '.',
      field("name", choice(
        op_regex,
        sym_regex,
      )),
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

    operator: _ => token(op_regex),

    symbol: _ => token(sym_regex),

    _newline: _ => token(/[\n;,]/),
    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?/),
  }
})
