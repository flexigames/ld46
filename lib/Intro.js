export default class Intro {
    constructor({camera, player, plant, setPause}) {
        camera.setPos((player.pos.x + plant.pos.x) / 2, (player.pos.y + plant.pos.y)/2)
        plant.onIntroEnd = () => {
            camera.transitionTo(player, () => {
                setPause(false)
                camera.follow(player)
            })
        }
    }
}