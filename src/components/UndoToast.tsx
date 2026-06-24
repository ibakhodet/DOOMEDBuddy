import type { GearToast } from '../data/types';

interface UndoToastProps {
  toast: GearToast;
  onUndo: () => void;
  onClose: () => void;
}

export default function UndoToast({ toast, onUndo, onClose }: UndoToastProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 90,
        zIndex: 36,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(#23282a, #16191b)',
        border: '1px solid #7a4fc0',
        borderRadius: 9,
        boxShadow: '0 6px 24px rgba(0,0,0,.6)',
        padding: '11px 13px',
        animation: 'cardIn .2s ease',
        gap: 10,
      }}
    >
      {/* Text */}
      <div
        style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          color: '#d6e0da',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 700, color: '#d2b6ff' }}>{toast.name}</span>
        {' \u2192 '}
        {toast.to}
      </div>

      {/* UNDO button */}
      <button
        onClick={onUndo}
        style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: '#d2b6ff',
          border: '1px solid #7a4fc0',
          borderRadius: 6,
          padding: '6px 13px',
          background: '#1a1426',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        UNDO
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: '#9aa8a0',
          border: '1px solid #3a4143',
          borderRadius: 6,
          padding: '6px 11px',
          background: 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        &#10005;
      </button>
    </div>
  );
}
