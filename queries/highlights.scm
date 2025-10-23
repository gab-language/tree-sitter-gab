; Highlights.scm for gab
[
 (comment)
] @comment

(number) @number

(symbol) @variable

(message) @function

(op_infix) @operator
(send_infix) @operator

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
((symbol) @module.builtin (#eq? @module.builtin "Strings"))
((symbol) @module.builtin (#eq? @module.builtin "Binaries"))
((symbol) @module.builtin (#eq? @module.builtin "Shapes"))
((symbol) @module.builtin (#eq? @module.builtin "Messages"))
((symbol) @module.builtin (#eq? @module.builtin "Numbers"))
((symbol) @module.builtin (#eq? @module.builtin "Blocks"))
((symbol) @module.builtin (#eq? @module.builtin "Records"))
((symbol) @module.builtin (#eq? @module.builtin "Fibers"))
((symbol) @module.builtin (#eq? @module.builtin "Channels"))
((symbol) @module.builtin (#eq? @module.builtin "Ranges"))
((symbol) @module.builtin (#eq? @module.builtin "IO"))
((symbol) @module.builtin (#eq? @module.builtin "Streams"))
