import { Howl } from "howler"

export default function play(name) {
  new Howl({
    src: "assets/audio/" + name + ".wav",
    volume: 0.2,
  }).play()
}
