; Highlights.scm for gab
[
 (comment)
] @comment

(number) @number

(symbol) @variable

(message) @function

(operator) @operator
(send) @operator

[
  (string)
] @string

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

((symbol) @variable.builtin (#eq? @variable.builtin "self"))
