import React from 'react'
import style from './loader.module.scss'

function Loader() {
    return (
        <div className={ style.loader_container }>
            <div className={ style.loader } />
        </div>
    )
}

export default Loader
