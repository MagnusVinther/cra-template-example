// Admin komponenter til at slette og redigerer kommentarer

// API
import axios from 'axios'

// Routing
import { useNavigate, useParams } from 'react-router-dom'

// Hooks
import {useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// Komponenter
import { useAuth } from '../../App/Auth/Auth'


// Kontrolpanel til admin for at kunne slette og redigerer
export const AdminControl = () => {
    // destructure af comment ID via url useParams
    const { comment_id } = useParams()
    // Router hook til at navigerer
    const navigate = useNavigate()
    // Destructure af Form-hook variabler
    const { register, handleSubmit, formState: {errors}} = useForm()
    // Destructure af loginData fra useAuth custom hook
    const { loginData } = useAuth()
    // Commentdata tilstand
    const [ commentData, setCommentData ] = useState({}) // Objekt

    //useEffect til styring af render.
    useEffect(() => {
        // Funktion til fetch af data
        const getData = async () => {
            const endpoint = `https://api.mediehuset.net/snippets/comments/admin`
            const options = {
                headers: {
                    Authorization: `Bearer ${loginData.access_token}`
                }
            }

            // Try/catch error handling på API kald
            try {
                if(loginData.access_token) {
                    const result = await axios.get(`${endpoint}/${comment_id}`, options)
                    // ændrer commentdata værdi til result.data
                    setCommentData(result.data)
                }
            }
            // Hvis fejl, fanges den hér
            catch (err) {
                console.error("der er fejl i admin-control fetch") // console.error(err) ??
            }
        }
        // Funktionskald 
        getData()
    // Dependency array
    }, [comment_id, loginData.access_token])

    // Form til at redigerer i kommentar
    const editForm = async (data, changeTo) => {
        const endpoint = "https://api.mediehuset.net/snippets/comments"
        const options = {
            headers: {
                Authorization: `Bearer ${loginData.access_token}`
            }
        }

        // URLSearchParams bruges til at definerer "hjælpe-metoder" til at arbejde med en query-string i en URL.
        const urlParams = new URLSearchParams()
        //Appender udvalgte data til urlParams
        urlParams.append('id', data.id)
        urlParams.append('title', data.title)
        urlParams.append('comment', data.comment)
        // Axios PUT-metode
        const result = await axios.put(endpoint, urlParams, options)
        console.log(result)

        if (result.status) {
            // Sender én tilbage til kommentarene og erstatter den redigerede kommentar.
            navigate(`/admin`, {replace: true})
        }
    }

    return (
        loginData.access_token && (
            // Closure
            <form onSubmit={handleSubmit(editForm)}>
                <input type="hidden" value={comment_id} {...register("id")} />
                <div>
                    <label htmlFor="title">Emne</label>
                    <input 
                        type="text" 
                        // Tager kommentarens tidligere værdier og beholder dem
                        defaultValue={commentData.title} 
                        onChange={(changeTo) => console.log(changeTo.target.value)}
                        {...register("title", { required: true })}/>
                    {errors.title && <span>Du skal skrive en titel</span>}
                </div>
                <div>
                    <label htmlFor="comment">Kommentar</label>
                    <textarea 
                        type="text" 
                        defaultValue={commentData.comment} 
                        onChange={(changeTo) => console.log(changeTo.target.value)}
                        {...register("comment", { required: true })}/>
                    {errors.comment && <span>Du skal skrive en kommentar</span>}
                </div>
                <div>
                    <button>Redigér nu</button>
                </div>
            </form>
        )
    )
}
