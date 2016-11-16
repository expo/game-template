import Exponent from 'exponent';
import React from 'react';
import { Alert, Dimensions, PanResponder } from 'react-native';

// Can't use `import ...` form because THREE uses oldskool module stuff.
const THREE = require('three');

// `THREEView` wraps a `GLView` and creates a THREE renderer that uses
// that `GLView`. The class needs to be constructed with a factory so that
// the `THREE` module can be injected without exponent-sdk depending on the
// `'three'` npm package.
const THREEView = Exponent.createTHREEViewClass(THREE);

import Assets from '../Assets';


//// Game

// Render the game as a `View` component.

export default (viewProps) => {
  //// Camera

  // An orthographic projection from 3d to 2d can be viewed as simply dropping
  // one of the 3d dimensions (say 'Z'), after some rotation and scaling. The
  // scaling here is specified by the width and height of the camera's view,
  // which ends up defining the boundaries of the viewport through which the
  // 2d world is visualized.
  //
  // Let `p`, `q` be two distinct points that are sent to the same point in 2d
  // space. The direction of `p - q` (henceforth 'Z') then serves simply to
  // specify depth (ordering of overlap) between the 2d elements of this world.
  //
  // The width of the view will be 4 world-space units. The height is set based
  // on the phone screen's aspect ratio.
  const width = 4;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const height = (screenHeight / screenWidth) * width;
  const camera = new THREE.OrthographicCamera(
    -width / 2, width / 2,
    height / 2, -height / 2,
    1, 10000,
  );
  camera.position.z = 1000;


  //// Scene, sprites

  // We just use a regular `THREE.Scene`
  const scene = new THREE.Scene();

  // Making a sprite involves three steps which are outlined below. You probably
  // would want to combine them into a utility function with defaults pertinent
  // to your game.

  // 1: Geometry
  // This defines the local shape of the object. In this case the geometry
  // will simply be a 1x1 plane facing the camera.
  const geometry = new THREE.PlaneBufferGeometry(1, 1);

  // 2: Material
  // This defines how the surface of the shape is painted. In this case we
  // want to paint a texture loaded from an asset and also tint it.
  // Nearest-neighbor filtering with `THREE.NearestFilter` is nice for
  // pixel art styles.
  const texture = THREEView.textureFromAsset(Assets['player-sprite']);
  texture.minFilter = texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xff0000,    // Sprites can be tinted with a color.
    transparent: true,  // Use the image's alpha channel for alpha.
  });

  // 3: Mesh
  // A mesh is a node in THREE's scenegraph and refers to a geometry and a
  // material to draw itself. It can be translated and rotated as any other
  // scenegraph node.
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Geometries and materials can be reused.
  const mesh2 = new THREE.Mesh(geometry, material);
  mesh2.position.x = mesh2.position.y = 0.5;
  mesh2.position.z = -40;     // This puts this sprite behind our previous one.
  mesh2.rotation.z = Math.PI;
  scene.add(mesh2);


  //// Events

  // This function is called every frame, with `dt` being the time in seconds
  // elapsed since the last call.
  const tick = (dt) => {
    mesh.rotation.z += 2 * dt;
  }

  // These functions are called on touch and release of the view respectively.
  const touch = (_, gesture) => {
    material.color.setHex(0x00ff00);
  };
  const release = (_, gesture) => {
    material.color.setHex(0xff0000);
  }


  //// React component

  // We bind our `touch` and `release` callbacks using a `PanResponder`. The
  // `THREEView` takes our `scene` and `camera` and renders them every frame.
  // It also takes our `tick` callbacks and calls it every frame.
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: touch,
    onPanResponderRelease: release,
    onPanResponderTerminate: release,
    onShouldBlockNativeResponder: () => false,
  });
  return (
    <THREEView
      {...viewProps}
      {...panResponder.panHandlers}
      scene={scene}
      camera={camera}
      tick={tick}
    />
  );
};



