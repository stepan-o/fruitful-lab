import type { ReviewCameraAction } from '../factory-study/review-orbit';
import styles from './agent-test.module.css';

export default function ReviewCameraControls({ ready, fixed, onAction }: {
  ready: boolean; fixed: boolean; onAction: (action: ReviewCameraAction) => void;
}) {
  return <div className={styles.orbitTools}>
    <span>{fixed ? 'Fixed CCTV angle · choose CAM 1–3' : 'Drag to orbit · Scroll / pinch to zoom · Arrow keys rotate'}</span>
    {!fixed && <div role='group' aria-label='Inspection camera'>
      <button disabled={!ready} aria-label='Zoom in' onClick={() => onAction('closer')}>+</button>
      <button disabled={!ready} aria-label='Zoom out' onClick={() => onAction('farther')}>−</button>
      <button disabled={!ready} onClick={() => onAction('reset')}>Reset camera</button>
    </div>}
  </div>;
}
