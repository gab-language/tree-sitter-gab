((binary_send
  lhs: (string [
    (doublestring)
    (singlestring)
  ] @injection.content)
  message: ((send) @injection.language (#offset! @injection.language 0 1 0 0)))
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))

((unary_send
  lhs: (string [
    (doublestring)
    (singlestring)
  ] @injection.content)
  message: ((send) @injection.language (#offset! @injection.language 0 1 0 0)))
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))
