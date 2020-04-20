import { Howl } from "howler"

export default function play(name) {
  new Howl({
    src: "assets/audio/" + name + ".wav",
    volume: 0.2,
  }).play()
}

export function playBackground() {
  new Howl({
    loop: true,
    autoplay: true,
    src: "assets/audio/background.mp3",
    volume: 0.1,
  })
}