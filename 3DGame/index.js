import Exponent from 'exponent';
import React from 'react';
import { Alert, PanResponder } from 'react-native';

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
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
  camera.position.z = 1000;

  const geometry = new THREE.BoxGeometry(200, 200, 200);

  const material = new THREE.MeshBasicMaterial({
    // This is how you create a `THREE.Texture` from an `Exponent.Asset`.
    map: THREEView.textureFromAsset(Assets['player-sprite']),
    color: 0xff0000,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const tick = (dt) => {
    mesh.rotation.x += 1 * dt;
    mesh.rotation.y += 2 * dt;
  }

  const touch = (_, gesture) => {
    material.color.setHex(0x00ff00);
  };
  const release = (_, gesture) => {
    material.color.setHex(0xff0000);
  }

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



