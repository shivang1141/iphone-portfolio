import { AnimatePresence, motion } from 'motion/react';
import { springs, type Note } from '../lib/os';

/**
 * The island morphs to fit a notification and shrinks back.
 * On a real phone (fullscreen) there is no fake hardware, so it only appears while it has something to say.
 */
export function DynamicIsland({ note, fullscreen }: { note: Note | null; fullscreen: boolean }) {
  if (fullscreen) {
    return (
      <AnimatePresence>
        {note && (
          <motion.div
            key="floating"
            className="island island-floating"
            role="status"
            initial={{ opacity: 0, transform: 'translateX(-50%) scale(0.9)' }}
            animate={{ opacity: 1, transform: 'translateX(-50%) scale(1)' }}
            exit={{ opacity: 0, transform: 'translateX(-50%) scale(0.9)', transition: { duration: 0.18 } }}
            transition={springs.island}
          >
            <IslandContent note={note} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="island-anchor">
      <motion.div
        layout
        className="island"
        data-expanded={note ? true : undefined}
        transition={springs.island}
        style={{ borderRadius: 40 }}
        role="status"
      >
        <AnimatePresence mode="popLayout">
          {note && (
            <motion.div
              key={note.title}
              layout="position"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.22, delay: 0.1 } }}
              exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12 } }}
            >
              <IslandContent note={note} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function IslandContent({ note }: { note: Note }) {
  return (
    <div className="island-content">
      <span className="island-icon">{note.icon}</span>
      <span className="island-text">
        <span className="island-title">{note.title}</span>
        {note.detail && <span className="island-detail">{note.detail}</span>}
      </span>
    </div>
  );
}
