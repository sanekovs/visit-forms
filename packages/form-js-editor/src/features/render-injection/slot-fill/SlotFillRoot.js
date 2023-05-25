import FillContext from './FillContext';
import SlotContext from './SlotContext';
import { useMemo, useState } from 'preact/hooks';

export default ({ children }) => {
  const [ fills, setFills ] = useState([]);

  const fillContext = useMemo(() => ({
    addFill: (fill) => {
      setFills((fills) => [ ...fills.filter((f) => f.id !== fill.id), fill ]);
    },
    removeFill: (id) => {
      setFills((fills) => fills.filter((f) => f.id !== id));
    }
  }), []);

  const slotContext = useMemo(() => ({ fills }), [ fills ]);

  return (
    <SlotContext.Provider value={ slotContext }>
      <FillContext.Provider /* @ts-expect-error */
        value={ fillContext }>
        { children }
      </FillContext.Provider>
    </SlotContext.Provider>
  );
};