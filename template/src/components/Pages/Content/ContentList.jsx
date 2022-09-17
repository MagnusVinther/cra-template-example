// Dette er en komponent som skal kunne vise en liste fra et API, som kan sendes videre til en Content side.
// "Content" skal i alle instanser ændrers udfra hvad man vil vise, så det er mere læsevenligt.

// Hooks og npm pakker
import { useEffect, useState } from 'react'
import axios from 'axios'

// Router
import { Link } from 'react-router-dom'

// Komponenter
import { Layout } from '../../App/Layout/Layout'

// Style
import Style from './ContentList.module.scss'


// Først en const navngivet "Content"+List
const ContentList = () => {

    // useState Hook til at deconstructe variabler til API data
    // Bruger en value og en setter, fortæller useState at jeg vil have et Array i dens parrenteser.
    const [ contentList, setContentList ] = useState([])

    // Herefter et useEffect Hook til at styre rendering
    useEffect(() => {

        // Asynkront funktionskald til at hente API data til liste
        const getContentList = async () => {

            // smider hele axios.get kald fra endpoint ind i en variabel som skal ændres udfra hvilket api man kalder fra
            const result = await axios.get(`https://api.mediehuset.net/snippets/products`)

            // Set'er vores contentlist til at indholde resultatet fra API kaldet.
            setContentList(result.data.products)
        }
        // Funktionskald
        getContentList()

        //Herunder skal man fortælle hvad der skal holdes øje med i dependency array
    }, [setContentList])

    // Hvad der skal returneres i DOMen
    return (
        // Layout komponent kaldes for at ændre title og description.
        <Layout title="ContentPage" description="Her står der hvad siden indeholder">
            {/* Mapping af listens indhold. Content kan hedde "hest" */}
            {contentList && contentList.map(content => {
                // returnerer komponent med content objektet som et data objekt
                return (
                    // Ved subgroup skal man tilføje et parameter til nedenstående som er destructured i useParams i toppen.
                    // Eg. const {group_id} = useParams(0).
                    // Herunder kan parametret være "hest"(men klogt er nok bare at skrive group_id={desctructured_value})
                    <ContentListItem key={content.id} data={content} />
                )
            })}
        </Layout>
    )
}

// Function component til håndtering af hvordan Items skal vises ud fra ContentList'en i DOM'en
// Props kan hedde hest. Bruges til at binde API data til funktions komponentens parametre.
const ContentListItem = props => {
    return (
        <div className={Style.Content_list_item_wrapper}>
            <span>
                <figure>
                    <img src={props.data.image} alt="NogetRelevantForBilledet" />
                </figure>
            </span>
            <span>
                <h3>{props.data.name}</h3>
                <p>{props.data.description_short}</p>
                <p>{<Link to={`/content/${props.data.id}`}>Læs mere &raquo;</Link>}</p>
            </span>
            <span>
                <p>Pris: {props.data.price} DKK</p>
                {/* <FavouriteButton button_id={props.data.id} /> */}
                {/* Favourite button kan tilføjes hvis den skal bruges */}
            </span>
        </div>
    )
}

// Named export af function components
export { ContentList, ContentListItem }