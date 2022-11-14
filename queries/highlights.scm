; Highlights.scm for gab

(comment) @comment

(number) @constant.numeric

(identifier) @variable

[
 (bool)
 (null)
] @constant.builtin

[
  (string)
  (rawstring)
  (interpstring)
] @string

[
 "for"
 "loop"
 "until"
] @keyword.repeat

[
 "if"
 "else"
 "match"
 "return"
] @conditional

[
  "or"
  "and"
  "not"
  "is"
  "in"
  "=>"
] @keyword.operator

[
  "let"
  "def"
] @keyword.storage.type

[
  ","
  "."
] @punctuation.delimiter

[
  "do"
  "end"
] @keyword

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
] @punctuation.bracket

[
  "+"
  "-"
  "%"
  "*"
  "/"
  "="
  "=="
  "<"
  "<="
  ">"
  ">="
  "!"
  "?"
  ".."
  ":"
] @operator

(symbol (identifier) @variable.builtin)

(parameters (identifier) @parameter)

(chain chain: (identifier) @type)
(chain final: (identifier) @function)

(function_definition type: (identifier) @type)

(function_definition name: (identifier) @function)
(object_definition name: (identifier) @type)
