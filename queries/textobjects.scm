(record) @class.outer
(record . "{" . (_) @_start (_)? @_end . "}"
  (#make-range! "class.inner" @_start @_end))

(list) @class.outer
(list . "[" . (_) @_start (_)? @_end . "]"
  (#make-range! "class.inner" @_start @_end))

(send lhs: (_) @parameters.outer)
(op lhs: (_) @parameters.outer)

(send rhs: (tuple . "(" . (_) @_start (_)? @_end . ")")
  (#make-range! "parameters.inner" @_start @_end))
(op rhs: (tuple . "(" . (_) @_start (_)? @_end . ")")
  (#make-range! "parameters.inner" @_start @_end))

(send) @call.outer
(op) @call.outer
