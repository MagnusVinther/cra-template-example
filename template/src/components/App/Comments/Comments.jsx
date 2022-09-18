import axios from 'axios'

// hooks
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Routing
import { useNavigate, useParams } from 'react-router-dom'

// Komponenter
import { useAuth } from '../Auth/Auth'

// Function component til kommentar formen. Destructured product_id, fundet med useParams
const CommentsForm = ({ product_id }) => {
    // useNavigate hook variable
    const navigate = useNavigate()
    // UseForm hook destrucure af variabler
    const { register, handleSubmit, formState: { errors }} = useForm()
    // destructure af Auth, som loginData
    const { loginData } = useAuth()

    // Funtion component til at submitte form (e = event)
    const submitForm = async (data, e) => {
        const endpoint = "https://api.mediehuset.net/snippets/comments"
        const options = {
            header: {
                Authorization: `Bearer ${loginData.access_token}`
            }
        }

        // Ny formdata med event som target.
        const formData = new FormData(e.target)
        //Spread-operator for at se alt under formData.
        console.log(...formData)
        // post metode som tager endpoint, formdata og options som parametre (hvorfra, hvortil, tilladelse - måske?)
        const result = await axios.post(endpoint, formData, options)
        //if-betingelse hvis result.data.status findes
        if (result.data.status) {
            // navigerer til path
            navigate(`/comments/response/${data.product_id}`, { replace: true })
        }
    }

    //returnerer i DOM
    return (
        //closure
        <form onSubmit={handleSubmit(submitForm)}>
            <input type="hidden" value={product_id} {...register("product_id")} />
            <div>
                <label htmlFor="title">Emne</label>
                <input type="text" {...register("title", { required: true })} />
                {errors.title && <span>Du skal skrive en titel</span>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" {...register("email",
                        {
                            required: true,
                            pattern: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
                        }
                    )} />
                {errors.email && errors.email.type === "required" && <span>Du skal skrive en email</span>}
                {errors.email && errors.email.type === "pattern" && <span>Du skal skrive en gyldig email</span> }
            </div>
            <div>
                <label htmlFor="comment">Kommentar</label>
                <textarea {...register("comment", { required: true })} />
                {errors.comment && <span>Du skal skrive en kommentar</span>}
            </div>
            <div>
                <button>Send</button>
            </div>
        </form>
    )
}

// Function component til at lave en liste af kommentarer
const CommentsList = () => {
    //destructure af product_id fra useParams / findes i URLen
    const { product_id } = useParams()
    //destructure af kommentar datas tilstand. værdi + setter
    const [ commentData, setCommentData] = useState([]) // finder et array

    // useEffectHook til at styre rendering når Product_id ændres
    useEffect(() => {
        // Datakalds funktion
        const getData = async () => {
            const endpoint = `https://api.mediehuset.net/snippets/comments/${product_id}` // ændres i forhold til relevant api.
            const result = await axios.get(endpoint)
            // finder data og smider dem ind - ændres med reverse metode
            setCommentData(result.data.items.reverse())
            console.log(result.data)
        }
        // Funktions kald
        getData()
    // Dependancy array til hvis product_id ændres. Så skal der renderes.
    }, [product_id])

    // returner loop af kommentarer med tilvalgte properties.
    return (
        <div>
            {commentData && commentData.map(item => {
                return (
                    <li key={item.id}>
                        {/* udskriver brugernavn på den som har skrevet kommentaren, emnet og kommentaren */}
                        <b>{item.user.username}</b>: <b>{item.title}</b> <p>{item.comment}</p>
                    </li>
                )
            })}
        </div>
    )
}

// Function component som skriver en hilsen når man har kommenteret.
const CommentsResponse = () => {
    <>
        <h1>Tak for din kommentar</h1>
        <CommentsList />
    </>
}

//named export da flere skal eksporteres.
export { CommentsForm, CommentsList, CommentsResponse }