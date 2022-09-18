// Hooks, react
import { useEffect } from 'react'

// Function Component til side-hovede layout, med props property (kan hedde hest)
const Layout = props => {
    // UseEffect til at styre rendering. Renderer når dependency array fanger en ændring
    useEffect(() => {
        // dokument titel
        document.title = props.title
        // Eksisterer description på props objekt (condition), så =
        if(props.description) {
            // gå ind i document, brug query selector til at finde metatag
            document.querySelector('meta[name="description"]')
                // Set attribut i content til værdi props.desc
                .setAttribute('content', props.description)
        }
        // Dependency array holder øje med ændringer i titel og description
    }, [props.title, props.description])

    // Returnering i DOM
    return (
        //React fragment som top-level element
        <>
            <h1>
                {props.title}
            </h1>
            <section>
                {/* indsætter fremover descendants/children i tilhørende placering */}
                {props.children}
            </section>
        </>
    )
}

// Named Export af Layout

export { Layout }