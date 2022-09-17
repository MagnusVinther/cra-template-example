// Dette er en komponent som skal gøre det muligt at trække detaljer fra et API, som skal sendes videre til Content siden.

// Hooks og Fetch
import { useEffect, useState } from 'react'
import axios from 'axios'

// Router
import { useParams } from 'react-router-dom'

// Komponenter
import { Layout } from '../../App/Layout/Layout'

// Laver en function component som skal finde et objekts detaljer fra et API
export const ContentDetails = () => {

    //Destructure product_id som senere skal bruges til at fange et ID i URL'en gennem axios endpoint. UseParams er et hook som, som regl, tager fat i URL'en, og har med routeren at gøre.
    const { content_id } = useParams()

    //Destructure af useState hook således at jeg kan finde en værdi og sætte en anden. UseState er defineret til at skulle finde et objekt.
    const [ contentData, setContentData ] = useState({})

    //Laver useEffect for at styre rendering af siden.
    useEffect(() => {

        //Laver en asynkron function til at indhente data fra API.
        const getContentData = async () => {

            //Med try/catch kan jeg sige at min funktion skal forsøge at sætte en ny værdi, og hvis ikke den kan det, så skal den fortælle mig at der er fejl. Det er altså error handling.
            try {

                // Laver en variabel som skal indeholde hvadend fetchen fanger. Den destructured "content_id" burges hér.
                const result = await axios.get(`https://api.mediehuset.net/snippets/products/${content_id}`)

                // Hér fortæller jeg min setter at den skal eje resultatet fra min fetch, og derefter finde data.item.
                setContentData(result.data.item)
            }

            // Hvis ikke jeg kan "sette" data, så skal den fange fejlen.
            catch(err) {
                console.error(err)
            }

            // Funktions Kald.  
            getContentData()
        }

    // Indsætter et dependency array, således at den renderer når der sker en ændring i URL'ens ID    
    }, [content_id])

    // Her er hvad der skal returneres i DOM'en
    return (
        <Layout title="Content Detaljer">
            {/* indsætter en ternary operator. Forklares betingelse ? hvis betingelse er sandt, gør "dette" : hvis betingelse ikke er sand så gør "dette" */}
            {
            // Er denne betingelse sand?
            contentData ?
            // Hvis sand, gør dette
            (
                <div>
                    <h2>{contentData.name}</h2>
                    {contentData.image && (
                        <img src={contentData.image} alt="RelevantForBillede" />
                    )}
                    <p className="nl2br">{contentData.description_long}</p>
                </div>
            ) :
            // Hvis ikke sand, så gør dette
            null //altså vis ingenting
            }
        </Layout>
    )
}

