import dynamic from 'next/dynamic'

import sketch from '../sketches/sketch'

const P5Wrapper = dynamic(
    () => import('react-p5-wrapper'),
    { ssr: false }
)

const p5 = () => {
    return (<> <P5Wrapper sketch={sketch} /> </>)
}

export default p5