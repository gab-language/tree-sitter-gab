
const PREC_EXP = 1
const PREC_ASSIGNMENT = 2
const PREC_OR = 3
const PREC_AND = 4
const PREC_EQUALITY = 5
const PREC_COMPARISON = 6
const PREC_TERM = 7
const PREC_FACTOR = 8
const PREC_UNARY = 9
const PREC_METHOD = 10
const PREC_PROPERTY = 11
const PREC_CALL = 12
const PREC_POST = 13

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  rules: {
    source_file: $ => $._block_body,

    _tuple: $ => prec.right(seq(
      repeat(
        seq(
          $._expression, ',',
        ),
      ),
      $._expression,
    )),

    chain: $ => prec.right(seq(
      field('chain', repeat(
        seq(
          $.identifier, '.',
        ),
      )),
      field('final', $.identifier),
    )),

    symbol: $ => seq(
      '$',
      $.identifier,
    ),

    _args: $ => choice(
      seq(
        '(',
        optional($._tuple),
        ')',
      ),
      $.record,
    ),

    parameters: $ => seq(
      repeat(
        seq(
          $._parameter, ',',
        ),
      ),
      $._parameter,
    ),

    _parameter: $ => choice(
      $.identifier,
    ),

    _identifiers: $ => prec.right(seq(
      repeat(
        seq(
          $.identifier, ',',
        )
      ),
      $.identifier
    )),

    _definition: $ => choice(
      $.function_definition,
      $.object_definition,
      $.const_definition,
    ),

    _ids: $ => seq(
      repeat(
        seq(
          choice(
            $.identifier,
          ),
          ',',
        ),
      ),
      $.identifier,
    ),

    _record_kvp: $ => prec(3, seq(
      choice(
        field('key', $.identifier),
        $._definition,
        seq(
          field('key', $.identifier),
          ':',
          field('value', $._expression),
        ),
        seq(
          field('key', seq(
            '[',
            $._expression,
            ']'
          )),
          ':',
          field('value', $._expression),
        )
      ),
    )),

    _block_body: $ => seq(
      repeat('\n'),
      repeat1(
        seq(
          $._expression,
          choice($.comment, '\n'),
          repeat('\n'),
        )
      ),
    ),

    _expression: $ => prec(PREC_EXP, choice(
      $._definition,
      $.symbol,
      $.record,
      $.list,
      $.for,
      $.loop,
      $.block,
      $.return,
      $.identifier,
      $.number,
      $.string,
      $.interpstring,
      $.bool,
      $.null,
      $.property,
      $.rawstring,
      $.group,
      $.binary,
      $.unary,
      $.post,
      $.index,
      $.comment,
      $.assignment,
      $.let,
      $.method,
      $.empty_method,
      $.match,
      $.if,
      $.comment,
    )),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
      seq('..', $._expression),
    )),

    post: $ => prec(PREC_POST, choice(
      seq($._expression, '!'),
      seq($._expression, '?'),
    )),

    binary: $ => choice(
      prec.left(PREC_TERM, seq($._expression, '+', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '-', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '..', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '*', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '/', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '%', $._expression)),
      prec.left(PREC_OR, seq($._expression, 'or', $._expression)),
      prec.left(PREC_AND, seq($._expression, 'and', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '<', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '>', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, 'is', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '==', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '<=', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '>=', $._expression)),
    ),

    record: $ => seq(
      '{',
      repeat(
        seq($._record_kvp,
          optional(','),
          optional(repeat('\n')),
        )),
      '}',
    ),

    list: $ => seq(
      '[',
      repeat(
        seq(
          $._expression,
          optional(','),
          optional(repeat('\n')),
        )
      ),
      ']',
    ),

    return: $ => prec.left(seq(
      'return',
      optional($._tuple),
    )),

    empty_method: $ => prec.left(PREC_METHOD, seq(
      ':',
      $.chain,
      optional(field('args', $._args)),
    )),

    method: $ => prec.left(PREC_METHOD, seq(
      field('receiver', $._expression),
      ':',
      $.chain,
      optional(field('args', $._args)),
    )),

    property: $ => prec(PREC_PROPERTY, seq(
      field('receiver', $._expression),
      '.',
      field('property', $.identifier),
    )),

    index: $ => prec(PREC_PROPERTY, seq(
      field('receiver', $._expression),
      '[',
      field('property', $._expression),
      ']'
    )),

    let: $ => prec.right(PREC_ASSIGNMENT, seq(
      'let',
      field('left', $._identifiers),
      '=',
      field('right', $._tuple),
    )),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('left', $._expression),
      '=',
      field('right', $._expression),
    )),

    group: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    for: $ => seq(
      'for',
      field('names', $._ids),
      'in',
      $._expression,
      '\n',
      field('body', $._block_body),
      'end',
    ),

    loop: $ => seq(
      'loop',
      '\n',
      field('body', $._block_body),
      'end',
      optional(seq(
        'until',
        $._expression,
      ))
    ),

    if: $ => prec.left(seq(
      'if',
      $._expression,
      '\n',
      optional($._block_body),
      'end',
      optional(seq(
        'else',
        '\n',
        $._block_body,
        'end',
      )),
    )),

    _matchoption: $ => seq(
      $._expression,
      '=>',
      $._expression,
      '\n',
    ),

    match: $ => prec.right(seq(
      'match',
      $._expression,
      '\n',
      field('case', repeat1($._matchoption)),
      '?',
      '=>',
      $._expression,
    )),

    block: $ => seq(
      'do',
      $._specialization,
      '\n',
      optional($._block_body),
      'end',
    ),

    _specialization: $ => choice(
      field('type', 
        seq(
          '[',
          $._expression,
          ']',
        )
      ),
      seq(
        '(',
        optional($.parameters),
        ')',
      ),
      seq(
        '[',
        $._expression,
        ']',
        '(',
        optional($.parameters),
        ')',
      ),
    ),

    function_definition: $ => seq(
      'def',
      field('name', $.identifier),
      $._specialization,
      '\n',
      optional(field('body', $._block_body)),
      'end',
    ),

    object_definition: $ => seq(
      'def',
      field('name', $.identifier),
      field('body', $.record),
    ),

    const_definition: $ => seq(
      'def',
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    bool: _ => choice('true', 'false'),

    null: _ => 'null',

    _interpstart: $ => token(seq(
      '\'',
      /[^\{\']*/,
      '{',
    )),

    _interpmiddle: $ => seq(
      $._expression,
      token(seq(
        '}',
        /[^\{\']*/,
        '{'
      ))
    ),

    _interpend: _ => token(seq(
      '}',
      /[^\'\{]*/,
      '\'',
    )),

    interpstring: $ => seq(
      $._interpstart,
      repeat($._interpmiddle),
      $._expression,
      $._interpend,
    ),

    string: _ => seq(
      '\'',
      /[^\']*/,
      '\'',
    ),

    rawstring: _ => token(seq(
      '"',
      /[^\"]*/,
      '"',
    )),

    comment: _ => token(
      seq(
        '#',
        /[^\n]*/,
        '\n'
      )
    ),

    identifier: _ => token(/[a-zA-Z_]+/),
    number: _ => token(/\d+/)
  }
})
