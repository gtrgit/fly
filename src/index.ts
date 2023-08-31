import { Transform, engine, Schemas, MeshCollider, MeshRenderer, AvatarAttach, CameraModeArea, CameraType } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
//import * as utils from "@dcl-sdk/utils"
//import { movePlayerTo } from '~system/RestrictedActions'
//import { bounceScalingSystem, circularSystem } from './systems'
//import { engine } from '@dcl/sdk/ecs'
//import { handleVerticalMovement } from './fly'
import { setupFlyingDemo } from './fly'
import { setupUi } from './ui'
//import { handleVerticalMovement } from './fly'


//import { getPlayerPosition } from './fly'
//import { flying } from './fly2'


// Defining behavior. See `src/systems.ts` file.
//engine.addSystem(circularSystem)
//engine.addSystem(bounceScalingSystem)

export function main() {
  // draw UI
  //setupFlyingDemo()
  setupUi()


  const entity = engine.addEntity()

CameraModeArea.create(entity, {
  area: Vector3.create(4, 3, 4),
  mode: CameraType.CT_FIRST_PERSON,
})
              // camera modifier bc we can't animate the avatar smoothly and glitchy camera angles
/*
              const changeCamEntity = engine.addEntity()
              AvatarAttach.create(changeCamEntity)
              MeshRenderer.setBox(changeCamEntity)
              Transform.create(changeCamEntity, {
                position: Vector3.Zero(), 
                scale: Vector3.create(55, 55, 55)
              })
  
              CameraModeArea.create(changeCamEntity, {
                area: Vector3.create(100, 100, 100),
                mode: CameraType.CT_THIRD_PERSON,
              })
              console.log("changed camera mode")
  
  //handleKeyPress()
 //handleVerticalMovement()

 // create a function to check the state of flying
/*
 function checkFlying(dt: number) {
  
  flying.valueOf()
  if (flying) {
    handleVerticalMovement()
  } else {
    engine.removeSystem(handleVerticalMovement)
  }

 }
  
 checkFlying(10)
 */
//getPlayerPosition()


}
