import { createChannel } from '../node_modules/decentraland-builder-scripts/channel'
import { createInventory } from '../node_modules/decentraland-builder-scripts/inventory'
import Script1 from "../4433f19e-8ad2-4567-a7f8-a2e6b8f6bc88/src/item"

const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
_scene.addComponentOrReplace(transform)

const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape = new GLTFShape("e8c04948-0255-4036-86ec-caae122f370f/GroundFloorSciFi_04/GroundFloorSciFi_04.glb")
gltfShape.withCollisions = true
gltfShape.isPointerBlocker = true
gltfShape.visible = true
entity.addComponentOrReplace(gltfShape)
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
entity.addComponentOrReplace(transform2)

const poapBooth = new Entity('poapBooth')
engine.addEntity(poapBooth)
poapBooth.setParent(_scene)
const transform3 = new Transform({
  position: new Vector3(1, 0, 1),
  rotation: new Quaternion(-8.7286512280495155e-16, 0.3826834261417389, -4.5619415800501883e-8, 0.9238795638084412),
  scale: new Vector3(1, 1, 1)
})
poapBooth.addComponentOrReplace(transform3)

const channelId = Math.random().toString(16).slice(2)
const channelBus = new MessageBus()
const inventory = createInventory(UICanvas, UIContainerStack, UIImage)

const script1 = new Script1()
script1.init()
script1.spawn(poapBooth, {}, createChannel(channelId, poapBooth, channelBus))
