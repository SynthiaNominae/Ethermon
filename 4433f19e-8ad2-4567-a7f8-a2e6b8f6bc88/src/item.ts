import { CLEAR_UI, PoapBoothSystem, STOP_ANIMATE } from './PoapBoothSystem'
import { handlePoap, showMessage, getPOAPImage } from './PoapFunctions'

export type Props = {
  onClickText?: string
  eventName?: string
  owner?: string
  hoverText?: string
}

export var purchased = false
export var claimed = false
export var clicked = false
//export var proxy = 'https://lkdcl.co/proxy/'

class Button implements IScript<Props> {
  active: Record<string, boolean> = {}
  idleAnim = new AnimationState('Idle_POAP', { looping: true })
  buyAnim = new AnimationState('Action_POAP', { looping: false })
  buttonAnim = new AnimationState('Button_Action', { looping: false })
  booths:any = {}
  boothIds: number[] = []
  boothClicked:boolean[] = []

  event: string
  eventsManager = new EventManager()
  host: Entity
  owner: string
  image?:string

  async init() {}

  getPoap(entity: Entity, event: string) {
    handlePoap(event)
    return
  }

  async spawn(host: Entity, props: Props, channel: IChannel) {
    this.event = props.eventName
    var booth = new Entity(host.name + '-poapbooth-' +this.booths.length)
    booth.setParent(host)
    this.booths[props.eventName] = {
      clicked: false,
      eventName: props.eventName
    }

    booth.addComponent(new GLTFShape('4433f19e-8ad2-4567-a7f8-a2e6b8f6bc88/models/poap_dispenser.glb'))
    booth.addComponent(new Transform({}))

    
    var poapImage = new Entity()
    poapImage.addComponent(new PlaneShape())
    poapImage.addComponent(new Material())
    var image_url = this.image ? this.image : await getPOAPImage(this.event)
    poapImage.getComponent(Material).albedoTexture = new Texture(image_url)
    poapImage.getComponent(Material).alphaTexture = new Texture("4433f19e-8ad2-4567-a7f8-a2e6b8f6bc88/textures/circle_mask.png")
    poapImage.addComponent(new Transform({
      position: new Vector3(0,1.75,0),
      rotation: Quaternion.Euler(0,180,180),
      scale: new Vector3(.6,.6,.6)
    }))
    poapImage.setParent(booth)

    engine.addSystem(new ImageRotator(poapImage))
    

    booth.addComponent(new Animator())
    booth.getComponent(Animator).addClip(this.idleAnim)
    booth.getComponent(Animator).addClip(this.buyAnim)

    var boothButton = new Entity(host.name + '-poapbutton')
    boothButton.addComponent(new GLTFShape('4433f19e-8ad2-4567-a7f8-a2e6b8f6bc88/models/poap_button.glb'))
    boothButton.addComponent(new Transform({}))
    boothButton.setParent(host)

    this.idleAnim.play()

    var self = this

    boothButton.addComponent(
      new OnPointerDown(
        () => {
          if (this.booths.hasOwnProperty(props.eventName)) {
            if(!this.booths[props.eventName].clicked){
              this.booths[props.eventName].clicked = true
              this.getPoap(booth, props.eventName)
            /*channel.sendActions([
              {
                entityName: host.name,
                actionId: 'getPoap',
                values: { event: props.eventName, id:self.booths.length-1 },
              },
            ])*/
          }
          else {
            showMessage(
              'Already clicked. No POAP Spamming!',
              5,
              CLEAR_UI,
              null
            )
          }
        }
          },
        {
          button: ActionButton.POINTER,
          hoverText: props.hoverText,
          distance: 2,
          showFeedback: true
        }
      )
    )
  }
}

export default Button

export class ImageRotator{
  image:Entity

  constructor(image:Entity){
    this.image = image 
  }
  update(){
    let rot = this.image.getComponent(Transform).rotation.eulerAngles.clone()
    this.image.getComponent(Transform).rotation = Quaternion.Euler(rot.x, rot.y + 1.5, rot.z)
  }
}
