import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'

import sketch from '../sketches/sketch'

const P5Wrapper = dynamic(
    () => import('react-p5-wrapper'),
    { ssr: false }
)

const Index = () => {
    const [ state, setState ] = useState({
        ws: true,
        midi_msg: ''
    })

    const hey = () => console.log('iii')

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/test')
        ws.onopen = () => console.log('ok from client')
        ws.onmessage = msg => setState({ws: ws, midi_msg: msg.data })
        setState({ ws: ws })
        // window.hello = hello
    },[])

    return(
        <>
        <div>
            <P5Wrapper sketch={sketch} reset={ false } myfunc={ hey }/>
            {/* <input 
                type='range' 
                min='60' 
                max='72'
                onChange={ (e) => state.ws.send(e.target.value) } 
            /> */}
            {/* <p style={{ fontSize: `${ state.midi_msg }px` }} >Hello Next.js</p>
            <p>MIDI Input { state.midi_msg }</p> */}
        </div>
        </>
    )
}
  
export default Index