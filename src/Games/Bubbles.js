import { useEffect, useState, useRef } from "react"
import { Stage, Layer, Circle, Text } from "react-konva"
import Konva from "konva"
import { uid } from "../utils/uid"

const bubbleTimer = 3000

function Bubbles() {
  const [bubbles, setBubbles] = useState([])
  const [fullscreen, setFullscreen] = useState(false)
  const [background, setBackground] = useState("black")

  const bubbleCreator = (event) => {
    const id = uid()

    const newBubble = {
      id,
      x: event.x,
      y: event.y,
      color: Konva.Util.getRandomColor(),
    }

    setBubbles((previousBubbles) => [...previousBubbles, newBubble])

    setTimeout(() => {
      setBubbles((previousBubbles) => [
        ...previousBubbles.filter((bubble) => bubble.id !== id),
      ])
    }, bubbleTimer)
  }

  useEffect(() => {
    document.addEventListener("click", bubbleCreator)
    document.addEventListener("fullscreenchange", fullscreenChanged)

    return () => {
      document.removeEventListener("click", bubbleCreator)
      document.removeEventListener("fullscreenchange", fullscreenChanged)
    }
  }, [])

  const fullscreenChanged = () => {
    if (document.fullscreenElement) {
      setFullscreen(true)
    } else {
      setFullscreen(false)
    }
  }

  const enterFullscreen = () => {
    const docElm = document.documentElement
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    } else if (docElm.mozRequestFullScreen) {
      /* Firefox */
      docElm.mozRequestFullScreen()
    } else if (docElm.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      docElm.webkitRequestFullscreen()
    } else if (docElm.msRequestFullscreen) {
      /* IE/Edge */
      docElm.msRequestFullscreen()
    }

    setFullscreen(true)
  }

  const toggleBackground = () =>
    background === "black" ? setBackground("white") : setBackground("black")

  const oppositeTextColor = () => (background === "black" ? "white" : "black")

  const controls = (
    <>
      <Text
        x={8}
        y={8}
        text="Enter fullscreen"
        fill={oppositeTextColor()}
        opacity={0.8}
        onClick={enterFullscreen}
        onTap={enterFullscreen}
      />
      <Text
        x={112}
        y={8}
        text="Change background"
        fill={oppositeTextColor()}
        opacity={0.8}
        onClick={toggleBackground}
        onTap={toggleBackground}
      />
    </>
  )

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ backgroundColor: background }}
    >
      <Layer>
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            x={bubble.x}
            y={bubble.y}
            color={bubble.color}
          />
        ))}
        {fullscreen || controls}
      </Layer>
    </Stage>
  )
}

const Bubble = ({ x, y, color }) => {
  const bubbleRef = useRef()
  const [animating] = useState(true)

  useEffect(() => {
    if (!animating) return

    const bubble = bubbleRef.current

    const animation = new Konva.Animation(
      (frame) => {
        const scale = 1 + frame.time * 0.0075
        bubble.scale({ x: scale, y: scale })
      },
      [bubble.getLayer()]
    )

    animation.start()

    return () => animation.stop()
  }, [animating])

  return (
    <Circle
      ref={bubbleRef}
      x={x}
      y={y}
      fill={color}
      opacity={0.5}
      width={25}
      height={25}
    />
  )
}

export default Bubbles
