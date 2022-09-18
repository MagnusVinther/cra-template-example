// imports
import axios from "axios";

// Hooks
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

// Komponenter
import { useAuth } from "../../App/Auth/Auth";
import { Login } from "../Login/Login";

// Styles
import './AdminPage.scss'


// Laver en function component som skal vise Admin-side, hvor man kan se liste over comments, og redigerer.
export const AdminPage = () => {
    // LoginData Kontekst destructure
    const { loginData } = useAuth()
    // Params content/product ID destructure
    const { content_id } = useParams()
    // Tilstands deconstructor på CommentData
    const [commentData, setCommentData] = useState([]) // Fanger et Array

    //useEffect hook til at hente api data
    useEffect(() => {
        // asynkron function da den skal trække fra api.
        const getData = async () => {
            // Laver er en options variable til at transporterer header properties og give adgang til token
            const options = {
                headers: {
                    Authorization: `Bearer ${loginData.access_token}`
                }
            }
            // Error handling try/catch.
            try {
                // Endpoint relativt til hvad man vil finde ( SKAL NOK ÆNDRES I FORHOLD TIL OPGAVE) !!!!!!!
                const endpoint = `https://api.mediehuset.net/snippets/comments/admin`
                // result med get-metode med endpoint og options properties
                const result = await axios.get(endpoint, options)
                    // if-betingelse. Hvis "true" så skal den give CommentData nye værdier fra api
                    if(result.data.items) {
                        // reverse funktion laver omvendt rækkefølge i udtræk. (closure?)
                        setCommentData(result.data.items.reverse())
                    }
            }
            // Fortæller hvor fejlen sker.
            catch(err) {
                console.error(`Fejl i fetch af admin data: ${err}`)
            }
        }

        // Findes loginData.access_token så laves et funktionskald på getData.
        if(loginData.access_token) {
            getData()
        }
    // Dependency array som fortæller at der først skal renderes når der sker en ændring i access token eller i forhold til indholdet
    }, [loginData.access_token, content_id]) // content_id relativt til hvad man leder efter. !!

    // Delete metode
    const deleteComment = async (comment_id) => {
        const options = {
            headers: {
                Authorization: `Bearer ${loginData.access_token}`
            }
        }

        // If-betingelse (vil du slette?)
        if(window.confirm("vil du virkelig slette denne kommentar?")) {
            // Laver endpoint for relativ kommentar
            const endpoint = `https://api.mediehuset.net/snippets/comments/${comment_id}`
            // Result slettes udfra endpoint, og autoriseres af options.
            const result = await axios.delete(endpoint, options)
                // If-betingelse som får siden til at refresh når en kommentar slettes. Kommentaren bliver nemlig ikke fjernet før siden er blevet genindlæst.
                if(result.status) (
                    window.location.reload(false)
                )
        }
    }

    // Dom return
    return loginData.access_token ? (
        <table className="CommentListTable"> 

        <thead>
            <tr>
                <th>handling</th>
                <th>emne</th>
            </tr>
        </thead>
        <hr/>

        <tbody>
        {commentData && commentData.map(item => {
            return (
            <tr key={item.id}>
                
            <td> {/* table data-cell */}
                {/* icon/knap til at redigerer */}
                <span title="rediger">
                    <Link to={`/admin/${item.id}`}>&#9998;</Link>
                </span>

                {/* icon/knap til at slette */}
                <span title="slet">
                    <Link to="#" onClick={() => deleteComment(item.id)}>&#128465;</Link>
                </span>
            </td>

                <td>{item.title} : {item.comment}</td>
            </tr>
            )
        })}
        </tbody>

        </table>
    ) : (
        <>
            <p>Du skal være logget ind for at kunne se admin-panel</p>
            <Login />
        </>
    )
}
