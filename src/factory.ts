import {
  Entity,
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  PointerEvents,
  PointerEventType,
  InputAction,
  Material
} from '@dcl/sdk/ecs'
import { Cube, Spinner, Plane } from './components'
import { Color4 } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils'

// Cube factory
export function createCube(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setBox(entity)
  MeshCollider.setBox(entity)
  Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()) })

  // Make the cube spin, with the circularSystem
  Spinner.create(entity, { speed: 10 * Math.random() })

  // if it is a spawner, then we set the pointer hover feedback
  if (spawner) {
    PointerEvents.create(entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
            hoverText: 'Press E to spawn',
            maxDistance: 100,
            showFeedback: true
          }
        }
      ]
    })
  }

  return entity
}



// Cube factory
export function createPlane(x: number, y: number, z: number,rx:number,ry:number,rz:number,rw:number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  Plane.create(entity)

  Transform.create(entity, { 
    position: {x, y, z},
    scale: {x:2,y:2,z:2},
	  rotation: {x:0,y:0,z:1,w:1} })

  // set how the cube looks and collides
  // MeshRenderer.setPlane(entity)
  MeshCollider.setPlane(entity)
  Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()) })


  // if it is a spawner, then we set the pointer hover feedback
  // if (spawner) {
  //   PointerEvents.create(entity, {
  //     pointerEvents: [
  //       {
  //         eventType: PointerEventType.PET_DOWN,
  //         eventInfo: {
  //           button: InputAction.IA_PRIMARY,
  //           hoverText: 'Press E to spawn',
  //           maxDistance: 100,
  //           showFeedback: true
  //         }
  //       }
  //     ]
  //   })
  // }

  return entity
}
