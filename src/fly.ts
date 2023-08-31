import { engine, CameraModeArea, CameraType, Transform, Entity, AvatarAttach, AvatarAnchorPointType, MeshRenderer, MeshCollider, VisibilityComponent, InputAction, pointerEventsSystem, TransformType } from '@dcl/sdk/ecs';
import { Vector3, Quaternion } from '@dcl/sdk/math';
import * as utils from "@dcl-sdk/utils";
import { movePlayerTo } from '~system/RestrictedActions';
import { triggerSceneEmote } from '~system/RestrictedActions';
import { createCube, createPlane } from './factory'


//// Ideal mechanism: 
/// Player clicks Fly on UI (or other button) which triggers a custom animation 
// clicking Fly also starts flymode where players gradually move upwards as they move in any direction
// in flymode, when not moving, the player should hover at a constant Y position
// when player clicks exit fly they should fall to the ground and remove flymode


/// Main issue: Player falling instead of hovering in mid air when still and glitchy camera angles


// If a player can perform a custom animation while flying (instead of walking/running) that would be awesome
// If the camera movements could be smoother and less glitchy it would be really nice


let flying = false;
let hovering = false;
let handleVerticalMovementAdded = false;
let playerTransform: TransformType; // Initialize as null
let currentYPosition: number = 0; // Initialize as 0
let lastUpdateTimestamp = 0; // Initialize with current timestamp

export function toggleFlyingState() {
  flying = !flying;
  console.log("Toggled flying");
  setupFlyingDemo();
}

export function toggleHoveringState() {
  hovering = !hovering;
  setupFlyingDemo();
}

let platform: Entity | null = null;


// let platform = createCube(1,1,1);

// let p2 = createCube(1,1,1)

// createPlane(1,1,1)


export function setupFlyingDemo() {
  if (flying) {
    if (!handleVerticalMovementAdded) {
      triggerSceneEmote({ src: 'models/dance10.glb', loop: true });
      engine.addSystem(handleVerticalMovement);
      handleVerticalMovementAdded = true;
      console.log("Added flying demo");
    }
    // movePlayerTo({
    //   newRelativePosition: Vector3.create(0, 10, 0),
    // });
  } else {
    if (handleVerticalMovementAdded) {
      engine.removeSystem(handleVerticalMovement);
      console.log("Removed flying demo");
      handleVerticalMovementAdded = false;
    }
  }

  if (platform && hovering) {
    const platformTransform = Transform.getMutable(platform);
    const playerTransform = Transform.get(engine.PlayerEntity);

    platformTransform.position.y = playerTransform.position.y;
  }

  else if (platform) {
    engine.removeEntity(platform);
    platform = null;
    console.log("exited fly mode")
  }

  if(!flying && !InputAction.IA_ANY && playerTransform) {
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - lastUpdateTimestamp;

    //Limit no. of updates
    if (timeSinceLastUpdate >= 1000000) {
      lastUpdateTimestamp = currentTime;
      const playerPosition = playerTransform.position;
      const updatedPlayerPosition = Vector3.create(playerPosition.x, currentYPosition, playerPosition.z);
      playerTransform.position = updatedPlayerPosition;
      
    }

  }

}

function createPlatform(position: Vector3) {
  if (!platform) {
    platform = engine.addEntity();
   
  }
  Transform.create(platform, {
    position: position,
    // scale: Vector3.create(5, .5, 5)
    scale: Vector3.create(1, 1.385, 1)

    // scale: Vector3.create(1, 1.385, 1),

  });
  AvatarAttach.create(platform, {
    anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
  });
  MeshRenderer.setBox(platform);
  MeshCollider.setBox(platform);
  VisibilityComponent.create(platform, { visible: true });
}

function handleVerticalMovement() {
  const playerTransform = Transform.get(engine.PlayerEntity);
  const cameraTransform = Transform.get(engine.CameraEntity);

  if (flying) {
    if (!platform) {
      createPlatform(playerTransform.position);
      console.log("Created platform");
    }

    const speed = 0.05;
    const cameraRotation = cameraTransform.rotation;

    const cameraEulerAngles = quaternionToEulerAngles(cameraRotation);
    const cameraForward = calculateCameraForward(cameraEulerAngles);
    
    
    const offset = calculateOffset(cameraForward, speed);

    if (platform && !hovering) {
       const platformTransform = Transform.getMutable(platform);

      const newPlatformPosition = calculateNewPosition(playerTransform.position, offset);
      
      // platformTransform.position = newPlatformPosition;
      // const updatedPos = engine.addEntity()
      
      // Transform.create(updatedPos, {position:  {x : platformTransform.position.x, 
      //                                           y : platformTransform.position.y , 
      //                                           z : platformTransform.position.z}})

      
      // platformTransform.position = Transform.getMutable(updatedPos).position;

    }
  } else if (platform) {
    engine.removeEntity(platform);
    platform = null;
    console.log("Exited fly mode");
  }
}


// Maths to switch between quaternion and euler for the camera
function quaternionToEulerAngles(quaternion: Quaternion): Vector3 {
  const x = Math.atan2(2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z),
    1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y));
  const y = Math.asin(2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x));
  const z = Math.atan2(2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y),
    1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z));

    
  return Vector3.create(x, y, z);
}

// Calculate camera direction
function calculateCameraForward(cameraEulerAngles: Vector3): Vector3 {
  const cameraForward = Vector3.create(
    Math.sin(cameraEulerAngles.y),
    0,
    Math.cos(cameraEulerAngles.y)
  );
  return cameraForward;
}

// Calculate offset
function calculateOffset(cameraForward: Vector3, speed: number): Vector3 {
  const offset = Vector3.create(
    cameraForward.x * speed,
    cameraForward.y * speed,
    cameraForward.z * speed
  );
  return offset;
}

// Calculate new position
function calculateNewPosition(position: Vector3, offset: Vector3): Vector3 {
  // const newPosition = Vector3.create(
  //   position.x + offset.x,
  //   position.y + offset.y,
  //   position.z + offset.z
  // );
  const newPosition = Vector3.create(
    position.x ,
    position.y + offset.y,
    position.z 
  );
  return newPosition;
}


/*
// Function to exit fly mode and drop the player to the floor
export function exitFlyMode() {
  flying = false; // Disable flying mode

  if (platform) {
    engine.removeEntity(platform); // Remove the platform
    platform = null; // Reset the platform reference
    console.log("exited fly mode");
    engine.removeSystem(handleVerticalMovement)
  }
}
*/