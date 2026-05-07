; Highlights.scm for gab
[
 (comment)
] @comment

(number) @number

(symbol) @variable

(message) @type

(op_infix) @operator
(send_infix) @operator

[
  (string)
] @string

[
  "do"
  "end"
  ":="
  "::"
] @keyword

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
] @punctuation.bracket

; self variable
((symbol) @variable.builtin (#eq? @variable.builtin "self"))
