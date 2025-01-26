export function Render({ children, if: _if }: Properties<{ if: boolean }>) {
  return _if ? children : undefined
}
