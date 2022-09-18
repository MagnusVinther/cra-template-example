

export const Main = props => {
  return (
    <main>
      {/* indsætter children i main komponenten. I app placeres page-komponenter inden i main komponenten, og den trækker derfra alle children */}
      {props.children}
    </main>
  )
}