import { cache } from '@overextended/ox_lib/client';

export function netEvent<T extends any[]>(event: string, fn: (...args: T) => void) {
  onNet(event, (...args: T) => {
    if (!source || (source as any) === '') return;

    fn(...args);
  });
}

export function hexToRgb(code: string) {
  let result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(code);
  if (!result) return null;

  let r: number = Number.parseInt(result[1], 16);
  let g: number = Number.parseInt(result[2], 16);
  let b: number = Number.parseInt(result[3], 16);

  return { r: r, g: g, b: b };
}

export function getDirectionFromRotation(rotation: { z: number; x: number }) {
  const cr: number = rotation.z * (Math.PI / 180);
  const xr: number = rotation.x * (Math.PI / 180);
  const cx: number = Math.cos(xr);

  return { x: -Math.sin(cr) * cx, y: Math.cos(cr) * cx, z: Math.sin(xr) };
}

export function calculateRotationFromNormal(normal: { x: number; y: number; z: number }) {
  const length: number = Math.hypot(normal.x, normal.y, normal.z);
  const x: number = normal.x / length;
  const y: number = normal.y / length;
  const z: number = normal.z / length;

  const pitchDeg: number = ((Math.asin(-z) * 180) / Math.PI + 360) % 360;
  const rollDeg: number = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const yawDeg: number = ((Math.atan2(-x, y) * 180) / Math.PI + 360) % 360;

  return { x: pitchDeg, y: rollDeg, z: yawDeg };
}

export function getRaycast(): { result: number; hit: any; coords: number[]; surface: number[]; entity: number } {
  const [x, y, z] = GetFinalRenderedCamCoord();
  const camPosition = { x, y, z };

  const [rotX, rotY, rotZ] = GetFinalRenderedCamRot(2);
  const camRotation = { x: rotX, y: rotY, z: rotZ };

  const forwardVector: { x: number; y: number; z: number } = getDirectionFromRotation(camRotation);
  const front = {
    x: camPosition.x + forwardVector.x * 10,
    y: camPosition.y + forwardVector.y * 10,
    z: camPosition.z + forwardVector.z * 10,
  };

  const raycast: number = StartShapeTestLosProbe(
    camPosition.x,
    camPosition.y,
    camPosition.z,
    front.x,
    front.y,
    front.z,
    -1,
    cache.ped,
    4,
  );
  const [result, hit, coords, surface, entity] = GetShapeTestResultIncludingMaterial(raycast);

  return { result, hit, coords, surface, entity };
}

export function hasItem(source: number, item: string): boolean {
  return exports.ox_inventory.GetItemCount(source, item) > 0;
}

export function sendChatMessage(source: number, message: string) {
  return exports.chat.addMessage(source, message);
}

export function isAdmin(source: string, group: string): boolean {
  return IsPlayerAceAllowed(source, group);
}

export function getHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

export function getDistance(one: number[], two: number[]): number {
  const x: number = one[0] - two[0];
  const y: number = one[1] - two[1];
  const z: number = one[2] - two[2];
  return Math.sqrt(x * x + y * y + z * z);
}

export function getArea(
  coords: { x: number; y: number; z: number },
  areas: { x: number; y: number; z: number; radius: number }[],
): boolean {
  return areas.some((area) => {
    const distance: number = Math.sqrt((coords.x - area.x) ** 2 + (coords.y - area.y) ** 2 + (coords.z - area.z) ** 2);
    return distance <= area.radius;
  });
}
