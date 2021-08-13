import { poapText } from "./PoapUIText"


export var STOP_ANIMATE = "stopanimate"
export var CLEAR_UI = "clearUI"

export class PoapBoothSystem {
    base:number
    timer:number
    action:string
    entity:any
    events:EventManager

    constructor(time:number, action:string, entity:any, events:EventManager){
        this.base = time
        this.timer = time
        this.entity = entity
        this.action = action
        this.events = events
    }
    update(dt: number) {
        if (this.timer > 0) {
          this.timer -= dt
        } else {
          this.timer = this.base
          switch(this.action){
              case STOP_ANIMATE:
                this.entity.getClip('Action_POAP').stop()
                this.entity.getClip('Idle_POAP').play()
                  break;
             case CLEAR_UI:
                poapText.visible = false
                break;
          }
          engine.removeSystem(this)
        }
      }
    }