import React from 'react'
import './ErrorBox.css'

export default function ErrorBox(props){
    return(
        <div className='error'>{props.message}</div>
    )
}